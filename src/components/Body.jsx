import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
const Body = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <br /><br /><br />
            <Footer />
        </>
    );
};

export default Body;