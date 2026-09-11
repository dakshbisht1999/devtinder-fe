import { useSelector } from "react-redux"

export const isLoggedIn = () => {
    const user = useSelector((store)=> store.user);
    console.log(user)

    // document.cookie
    //     .split(";")
    //     .map((cookie) => cookie.trim().split("=")[0])
    //     .includes("token");

    // localStorage.getItem("isUserLoggedIn")

    return user ? true : false;
}