import { Link } from "react-router-dom";
import { useIsLoggedIn, useAuthUser } from "../auth";
import axiosInstance from "../utils/axios";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import { clearAuthenticatedSession } from "../utils/authSession";
import GoogleLoginBtn from "./GoogleLoginBtn";
import Breadcrumb from "./Breadcrumb";
import { useState } from "react";

const NavBar = () => {
    const loggedIn = useIsLoggedIn();
    const user = useAuthUser();
    // 1. Manage the open/closed state of the drawer
    const [isOpen, setIsOpen] = useState(false);

    // 2. Helper function to close the drawer
    const closeDrawer = () => setIsOpen(false);

    const dispatch = useDispatch();

    const handleLogout = async () => {
      try{
        const res = await axiosInstance.post("/auth/logout",{});
        if(res.data.success){
          clearAuthenticatedSession();
          dispatch(removeUser());
          toast.success(res.data.message || "Logged out successfully.");
        }
        
      } catch (err) {
        handleApiError(err);
      }
    }

    return (
      <>
        <div className="drawer">
          {/* 3. Bind the checkbox state and change handler to React */}
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle sm:hidden"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)} />
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <div className="navbar bg-base-300 w-full">
              <div className="flex-none sm:hidden">
                <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="flex-1">

                <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-tight text-primary">💻 DevTinder</Link>

              </div>
              <div className="hidden flex-none px-4 sm:block">
                <ul className="menu menu-horizontal items-center p-0">
                  {/* Navbar menu content here */}

                  {loggedIn ? (
                    <>
                      <p>Welcome, {user?.firstName}</p>
                      <div className="dropdown dropdown-end mx-5">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="Tailwind CSS Navbar component"
                              src={user?.photoUrl} />
                          </div>
                        </div>
                        <ul
                          tabIndex={-1}
                          className="menu menu-sm dropdown-content bg-primary text-primary-content rounded-box z-9 mt-3 w-52 p-2 shadow">
                          <li><Link to="/feed">Feed</Link></li>
                          <li><Link to="/profile">Profile</Link></li>
                          <li><Link to="/requests">Requests <span className="badge">New</span></Link></li>
                          <li><Link to="/connections">Connections</Link></li>
                          <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn btn-primary mr-4">Login</Link>
                      <GoogleLoginBtn />
                    </>
                  )}

                </ul>
              </div>
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            {/* 4. Attach closeDrawer to your navigation ul */}
            <ul className="menu bg-primary text-primary-content min-h-full w-80 p-4" onClick={closeDrawer}>
              {/* Sidebar content here */}
              {loggedIn ? (
                <>
                  <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-tight text-white">💻 DevTinder</Link>
                  <li className="mt-5">
                    <a>
                      <div className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                          <img alt="Tailwind CSS Navbar component" src={user?.photoUrl} />
                        </div>
                      </div>
                      <p>Welcome, {user?.firstName}</p>
                    </a>
                    <ul className="ml-8 before:bg-black before:opacity-100">
                      <li><Link to="/feed">Feed</Link></li>
                      <li><Link to="/profile">Profile</Link></li>
                      <li><Link to="/requests" className="flex">Requests <span className="badge">New</span></Link></li>
                      <li><Link to="/connections">Connections</Link></li>
                      <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                </>
              ):(
                <>
                  <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-tight text-white">💻 DevTinder</Link>
                  <Link to="/login" className="btn btn-base mt-10 mb-4">Login</Link>
                  <a><GoogleLoginBtn /></a>
                </>
              )}
            </ul>
          </div>
        </div>
        <Breadcrumb />
      </>
    );
};
export default NavBar;
