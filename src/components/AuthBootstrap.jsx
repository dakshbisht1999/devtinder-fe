import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuthReady } from "../auth";
import axiosInstance from "../utils/axios";
import { addUser, removeUser } from "../utils/userSlice";

const AuthBootstrap = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthReady = useAuthReady();

    useEffect(() => {
        let isActive = true;

        const restoreSession = async () => {
            try {
                // The browser sends the token cookie with this request. This
                // also works when the cookie is HttpOnly and therefore cannot
                // be read through document.cookie.
                const response = await axiosInstance.get("/profile/view");

                if (isActive && response.data.success) {
                    dispatch(addUser(response.data.data));
                } else if (isActive) {
                    dispatch(removeUser());
                }
            } catch {
                if (isActive) dispatch(removeUser());
            }
        };

        restoreSession();

        return () => {
            isActive = false;
        };
    }, [dispatch]);

    if (!isAuthReady) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }

    return children;
};

export default AuthBootstrap;
