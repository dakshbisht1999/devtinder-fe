import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}$/;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");
    

    const validatePassword = (value, type) => {
        const error = !value.trim() 
            ? "Required" 
            : !passwordPattern.test(value)
                ? "Enter a valid password."
                : type === "new" && value === oldPassword
                    ? "Enter a different password than old."
                    : "";

        type === "old" ? setOldPasswordError(error) : setPasswordError(error);
        return !error;
    };

    const compareConfirmPassword = (value) => {
        const error = !value.trim() 
            ? "Required" 
            : value !== password
                ? "Password doesn't matched."
                : "";

        setConfirmPasswordError(error);
        return !error;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isOldPasswordValid = validatePassword(oldPassword, "old");
        const isPasswordValid = validatePassword(password, "new");
        const isPasswordMatched = compareConfirmPassword(confirmPassword);

        if (!isOldPasswordValid || !isPasswordValid || !isPasswordMatched) return;

        setSubmitError("");

        try{
            // await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ emailId, password }),
            // });

            const res = await axiosInstance.patch(
                "/profile/password", 
                {
                    currentPassword: oldPassword,
                    newPassword: password
                }
            );
            // console.log(res)

            if(res.data.success){
                toast.success(`${res.data?.message || "Password changed successfully."}`);
                navigate("/");
            }
        } catch (err) {
            // Signup errors belong beside the form, so do not also show a toast.
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
                            Change Password
                        </h2>

                        <form className="fieldset w-xs p-4"
                            onSubmit={handleSubmit}>
                            <fieldset className="fieldset">
                                <label className="label">Current Password</label>
                                <input 
                                    type="password" 
                                    className="input validator" 
                                    placeholder="Current Password" 
                                    value={oldPassword}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setOldPassword(value);
                                        if (submitError) setSubmitError("");
                                        if (passwordError) validatePassword(value, "old");
                                    }}
                                    onBlur={(event) => validatePassword(event.target.value, "old")}
                                    aria-invalid={Boolean(oldPasswordError)}
                                />
                                {oldPasswordError && <p className="validator-hint my-0">{oldPasswordError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">New Password</label>
                                <input 
                                    type="password" 
                                    className="input validator" 
                                    placeholder="New Password" 
                                    value={password}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setPassword(value);
                                        if (submitError) setSubmitError("");
                                        if (passwordError) validatePassword(value, "new");
                                    }}
                                    onBlur={(event) => validatePassword(event.target.value, "new")}
                                    aria-invalid={Boolean(passwordError)}
                                />
                                {passwordError && <p className="validator-hint my-0">{passwordError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Confirm New Password</label>
                                <input 
                                    type="text" 
                                    className="input validator" 
                                    placeholder="Confirm New Password" 
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setConfirmPassword(value);
                                        if (submitError) setSubmitError("");
                                        if (confirmPasswordError) compareConfirmPassword(value);
                                    }}
                                    onBlur={(event) => {
                                        compareConfirmPassword(event.target.value)
                                    }}
                                    aria-invalid={Boolean(confirmPasswordError)}
                                />
                                {confirmPasswordError && <p className="validator-hint my-0">{confirmPasswordError}</p>}
                            </fieldset>

                            {submitError && (
                                <div className="alert alert-error mt-1" role="alert">
                                    <span>{submitError}</span>
                                </div>
                            )}
                            <button className="btn btn-primary mt-1" type="submit">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ResetPassword;
