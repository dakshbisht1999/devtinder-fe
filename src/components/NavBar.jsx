import { Link } from "react-router-dom";
import { useIsLoggedIn, useAuthUser } from "../auth";
import axiosInstance from "../utils/axios";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { handleApiError } from "../utils/errorHandler";

const NavBar = () => {
    const loggedIn = useIsLoggedIn();
    const user = useAuthUser();

    const dispatch = useDispatch();

    const handleLogout = async () => {
      try{
        const res = await axiosInstance.post("/auth/logou",{});
        // console.log(res.data.success)
        if(res.data.success){
          // console.log("hi")
          dispatch(removeUser(res.data))
          // console.log(res.data.message)
        }
        
      } catch (err) {
        handleApiError(err);
      }
    }

    return (
      // <div>NavBar</div>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link to={loggedIn ? "/feed" : "/login"} className="btn btn-ghost text-xl">💻 DevTinder</Link>
        </div>
        <div className="flex gap-2 items-center">
          {/* <input type="text" placeholder="Search" className="input w-24 md:w-auto" /> */}
          {loggedIn && (
            <>
              <p>Welcome, {user.firstName}</p>
              <div className="dropdown dropdown-end mx-5">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user.photoUrl} />
                  </div>
                </div>
                <ul
                  tabIndex={-1}
                  className="menu menu-sm dropdown-content bg-primary text-primary-content rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    );
};
export default NavBar;
