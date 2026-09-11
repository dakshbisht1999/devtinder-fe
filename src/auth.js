export const isLoggedIn = () =>
    // document.cookie
    //     .split(";")
    //     .map((cookie) => cookie.trim().split("=")[0])
    //     .includes("token");
    localStorage.getItem("isUserLoggedIn")
