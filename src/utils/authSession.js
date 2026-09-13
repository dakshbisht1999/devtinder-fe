const authSessionKey = "devtinder-auth-session";

export const markAuthenticatedSession = () => {
    sessionStorage.setItem(authSessionKey, "true");
};

export const hasAuthenticatedSession = () =>
    sessionStorage.getItem(authSessionKey) === "true";

export const clearAuthenticatedSession = () => {
    sessionStorage.removeItem(authSessionKey);
};
