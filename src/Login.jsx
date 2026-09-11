import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./utils/axios";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const [emailId, setEmailId] = useState("aliabhatt1@gmail.com");
    const [emailIdError, setEmailIdError] = useState("");
    const [password, setPassword] = useState("Abcd@1234");
    const [passwordError, setPasswordError] = useState("");

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
                                        if (emailIdError) validateEmail(value);
                                    }}
                                    onBlur={(event) => validateEmail(event.target.value)}
                                    aria-invalid={Boolean(emailIdError)}
                                />
                                {emailIdError && <p className="validator-hint">{emailIdError}</p>}
                            </fieldset>

                            <label className="fieldset">
                                <span className="label">Password</span>
                                <input 
                                    type="password" 
                                    className="input validator" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setPassword(value);
                                        if (passwordError) validatePassword(value);
                                    }}
                                    onBlur={(event) => validatePassword(event.target.value)}
                                    aria-invalid={Boolean(passwordError)}
                                />
                                {passwordError && <span className="validator-hint">{passwordError}</span>}
                            </label>

                            <button className="btn btn-primary mt-4" type="submit">Login</button>
                            <Link className="btn btn-soft btn-warning mt-1" to="/resetPassword">Reset Password</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;
