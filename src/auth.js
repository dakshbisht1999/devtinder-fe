import { useSelector } from "react-redux";

export const useAuthUser = () => useSelector((store) => store.user.data);

export const useIsLoggedIn = () => Boolean(useAuthUser());

export const useAuthReady = () =>
    useSelector((store) => store.user.status !== "checking");
