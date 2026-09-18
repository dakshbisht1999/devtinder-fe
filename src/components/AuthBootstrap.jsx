import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuthReady } from "../auth";
import axiosInstance from "../utils/axios";
import { addUser, removeUser } from "../utils/userSlice";
import { handleApiError, isTokenExpiredError } from "../utils/errorHandler";
import { hasAuthenticatedSession, markAuthenticatedSession } from "../utils/authSession";
import Loader from "./Loader";

const hasCookie = (name) =>
    document.cookie
        .split("; ")
        .some((cookie) => cookie.startsWith(`${name}=`));

const AuthBootstrap = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthReady = useAuthReady();

    useEffect(() => {
        let isActive = true;
        // Read this before the profile request. If a token was sent but the
        // server rejects it, it is an expired/invalid session—not a new visitor.
        const hadTokenCookie = hasCookie("token");
        const hadAuthenticatedSession = hasAuthenticatedSession();

        const restoreSession = async () => {
            try {
                // The browser sends the token cookie with this request. This
                // also works when the cookie is HttpOnly and therefore cannot
                // be read through document.cookie.
                const response = await axiosInstance.get("/profile/view", {
                    skipGlobalAuthErrorHandling: true,
                });

                if (isActive && response.data.success) {
                    markAuthenticatedSession();
                    dispatch(addUser(response.data.data));
                } else if (isActive) {
                    dispatch(removeUser());
                }
            } catch (error) {
                if (!isActive) return;

                const isUnauthorized = error.response?.status === 401;

                // A missing cookie is expected for a visitor opening the login
                // page. A present token—or TOKEN_EXPIRED from the API—rejected
                // with 401 is an expired session.
                handleApiError(error, {
                    notify: !isUnauthorized || hadTokenCookie || hadAuthenticatedSession || isTokenExpiredError(error),
                });
                if (isActive) dispatch(removeUser());
            }
        };

        restoreSession();

        return () => {
            isActive = false;
        };
    }, [dispatch]);

    if (!isAuthReady) {
        return (
            <>
                <Loader />
            </>
        );
    }

    return children;
};

export default AuthBootstrap;
