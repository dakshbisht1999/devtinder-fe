import { toast } from "react-toastify";
import appStore from "./appStore";
import { removeUser } from "./userSlice";
import { clearAuthenticatedSession } from "./authSession";

const fallbackMessage = "Something went wrong. Please try again.";

export const getApiErrorMessage = (error) =>
    error.response?.data?.message || error.message || fallbackMessage;

export const isLoginRequest = (error) =>
    error.config?.url?.includes("/auth/login");

// Prefer this server-supplied code when the token cookie is HttpOnly and the
// browser therefore cannot tell whether a token was present before the request.
export const isTokenExpiredError = (error) =>
    error.response?.data?.code === "TOKEN_EXPIRED";

export const handleApiError = (error, { notify = true } = {}) => {
    // The interceptor may already have handled an expired session. Avoid a
    // second toast when the originating component reaches its catch block.
    if (error.config?.globalErrorHandled) return getApiErrorMessage(error);

    const isSessionExpired = error.response?.status === 401 && !isLoginRequest(error);

    if (isSessionExpired) {
        error.config.globalErrorHandled = true;
        clearAuthenticatedSession();
        appStore.dispatch(removeUser());

        if (notify) toast.error("Your session has expired. Please log in again.");
        return getApiErrorMessage(error);
    }

    if (notify) toast.error(getApiErrorMessage(error));
    return getApiErrorMessage(error);
};
