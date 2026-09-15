import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import { markAuthenticatedSession } from "../utils/authSession";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
};

const Login = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [emailId, setEmailId] = useState(location.state?.emailId || "");
    const [emailIdError, setEmailIdError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const validateEmail = (value) => {
        const error = !value.trim()
            ? "Required"
            : !emailPattern.test(value)
                ? "Enter a valid email address."
                : "";

        setEmailIdError(error);
        return !error;
    };

    const validatePassword = (value) => {
        const error = !value.trim() ? "Required" : "";

        setPasswordError(error);
        return !error;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isEmailValid = validateEmail(emailId);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) return;

        setSubmitError("");

        try{
            // await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ emailId, password }),
            // });

            const res = await axiosInstance.post(
                "/auth/login", 
                { emailId, password }
            );
            // console.log(res)

            if(res.data.success){
                // localStorage.setItem("isUserLoggedIn",true)
                // localStorage.setItem("loggedInUser",JSON.stringify(res.data.data));

                markAuthenticatedSession();
                dispatch(addUser(res.data.data));
                toast.success(`${getGreeting()}, ${res.data.data?.firstName || "welcome back"}!`);
            }
        } catch (err) {
            // Login errors belong beside the form, so do not also show a toast.
            setSubmitError(handleApiError(err, { notify: false }));
        }
    };

    return (
        <>
            {/* <h1>Login Page</h1> */}
            <div className="flex justify-center items-center my-20">
                <div className="card bg-base-300 w-96 shadow-sm ">
                    {/* <figure>
                        <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes" />
                    </figure> */}
                    <div className="card-body">
                        <h2 className="card-title flex justify-center">
                            LOGIN @DevTinder
                        </h2>

                        <form className="fieldset w-xs p-4"
                            noValidate onSubmit={handleSubmit}>
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input validator"
                                    placeholder="Email"
                                    value={emailId}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setEmailId(value);
                                        if (submitError) setSubmitError("");
                                        if (emailIdError) validateEmail(value);
                                    }}
                                    onBlur={(event) => validateEmail(event.target.value)}
                                    aria-invalid={Boolean(emailIdError)}
                                />
                                {emailIdError && <p className="validator-hint">{emailIdError}</p>}
                            </fieldset>

                            <label className="fieldset mb-3">
                                <span className="label">Password</span>
                                <input 
                                    type="password" 
                                    className="input validator" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setPassword(value);
                                        if (submitError) setSubmitError("");
                                        if (passwordError) validatePassword(value);
                                    }}
                                    onBlur={(event) => validatePassword(event.target.value)}
                                    aria-invalid={Boolean(passwordError)}
                                />
                                {passwordError && <span className="validator-hint">{passwordError}</span>}
                            </label>
                            {submitError && (
                                <div className="alert alert-error mt-1" role="alert">
                                    <span>{submitError}</span>
                                </div>
                            )}
                            <button className="btn btn-primary mt-1" type="submit">Login</button>
                            <Link className="btn btn-soft btn-warning mt-1" to="/resetPassword">Reset Password</Link>
                            <br /><hr /><br />
                            <Link className="btn btn-soft btn-secondary mt-1" to="/signup">Sign Up</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;
