import { toast } from "react-toastify";
import appStore from "./appStore";
import { removeUser } from "./userSlice";

const fallbackMessage = "Something went wrong. Please try again.";

export const getApiErrorMessage = (error) =>
    error.response?.data?.message || error.message || fallbackMessage;

export const isLoginRequest = (error) =>
    error.config?.url?.includes("/auth/login");

export const handleApiError = (error, { notify = true } = {}) => {
    // The interceptor may already have handled an expired session. Avoid a
    // second toast when the originating component reaches its catch block.
    if (error.config?.globalErrorHandled) return getApiErrorMessage(error);

    const isSessionExpired = error.response?.status === 401 && !isLoginRequest(error);

    if (isSessionExpired) {
        error.config.globalErrorHandled = true;
        appStore.dispatch(removeUser());

        if (notify) toast.error("Your session has expired. Please log in again.");
        return getApiErrorMessage(error);
    }

    if (notify) toast.error(getApiErrorMessage(error));
    return getApiErrorMessage(error);
};
