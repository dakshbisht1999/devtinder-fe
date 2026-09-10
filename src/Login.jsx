import { useState } from "react";
import { Link } from "react-router-dom";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value) => {
        const error = !value.trim()
            ? "Required"
            : !emailPattern.test(value)
                ? "Enter a valid email password"
                : "";

        setEmailError(error);
        return !error;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        validateEmail(email);
    };

    return (
        <>
            {/* <h1>Login Page</h1> */}
            <div className="flex justify-center items-center my-20">
                <div className="card bg-base-200 w-96 shadow-sm ">
                    {/* <figure>
                        <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes" />
                    </figure> */}
                    <div className="card-body">
                        <h2 className="card-title flex justify-center">
                            LOGIN @DevTinder
                        </h2>

                        <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
                            noValidate onSubmit={handleSubmit}>
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    className="input validator"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setEmail(value);
                                        if (emailError) validateEmail(value);
                                    }}
                                    onBlur={(event) => validateEmail(event.target.value)}
                                    aria-invalid={Boolean(emailError)}
                                />
                                {emailError && <p className="validator-hint">{emailError}</p>}
                            </fieldset>

                            <label className="fieldset">
                                <span className="label">Password</span>
                                <input type="password" className="input validator" placeholder="Password" required />
                                <span className="validator-hint hidden">Required</span>
                            </label>

                            <button className="btn btn-neutral mt-4" type="submit">Login</button>
                            <Link className="btn btn-ghost mt-1" to="/resetPassword">Reset Password</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;
