import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setEmailServiceNotice } from "../utils/emailServiceNoticeSlice";

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}$/;
const emailPattern = /^\S+@\S+\.\S+$/;

const ResetPasswordViaOtp = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [emailId, setEmailId] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const dispatch = useDispatch();
    

    const validatePassword = (value) => {
        const error = !value.trim() 
            ? "Required" 
            : !passwordPattern.test(value)
                ? "Enter a valid password."
                : "";

        setPasswordError(error);
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

    const sendOtp = async () => {
        const normalizedEmail = emailId.trim();

        if (!emailPattern.test(normalizedEmail)) {
            setSubmitError("Enter a valid email address.");
            return;
        }

        setSubmitError("");
        setIsSendingOtp(true);

        try {
            const res = await axiosInstance.post("/auth/forget-password-via-otp", { emailId: normalizedEmail });

            if (res.data.success) {
                setOtp("");
                setOtpSent(true);
                toast.success(res.data.message || "OTP sent successfully.");
            } else {
                setSubmitError(res.data.message || "Unable to send OTP. Please try again.");
            }
        } catch (err) {
            setSubmitError(handleApiError(err, { notify: false }));
        } finally {
            setIsSendingOtp(false);
        }
    };

    const verifyOTP = async (event) => {
        event.preventDefault();

        if (!otpSent) {
            setSubmitError("Send an OTP before verifying it.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setSubmitError("Enter the six-digit OTP.");
            return;
        }

        setSubmitError("");
        setIsVerifyingOtp(true);

        try {
            const res = await axiosInstance.post(
                "/auth/forget-password-via-otp/verify",
                { emailId: emailId.trim(), otp }
            );

            if (res.data.success) {
                setOtpVerified(true);
                toast.success(`${res.data?.message || "OTP verified. You may now set a new password"}`);
            } else {
                setSubmitError(res.data.message || "Unable to verify OTP. Please try again.");
            }
        } catch (err) {
            setSubmitError(handleApiError(err, { notify: false }));
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isPasswordValid = validatePassword(password);
        const isPasswordMatched = compareConfirmPassword(confirmPassword);

        if (!isPasswordValid || !isPasswordMatched) return;

        setSubmitError("");

        try{
            // await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ emailId, password }),
            // });

            const res = await axiosInstance.post(
                "/auth/forget-password-via-otp/reset", 
                {
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

    useEffect(() => {
        dispatch(setEmailServiceNotice(
        "Email delivery is currently running in AWS SES sandbox mode. Messages can only be delivered to SES-verified email addresses."
        ));
    }, [dispatch]);

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
                            Reset Password
                        </h2>

                        {!otpVerified && <form className="fieldset w-xs p-4"
                            onSubmit={verifyOTP}>
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <div className="join">
                                    <div>
                                        <label className="input validator join-item">
                                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <g
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                                strokeWidth="2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                >
                                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                                </g>
                                            </svg>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={emailId}
                                                onChange={(event) => {
                                                    setEmailId(event.target.value);
                                                    setOtpSent(false);
                                                    setOtp("");
                                                    if (submitError) setSubmitError("");
                                                }}
                                                required
                                                disabled={otpSent}
                                            />
                                        </label>
                                        <div className="validator-hint hidden">Enter valid email address</div>
                                    </div>
                                    <button
                                        className="btn btn-neutral join-item"
                                        type="button"
                                        disabled={isSendingOtp || otpSent}
                                        onClick={sendOtp}>
                                        {isSendingOtp
                                            ? <span className="loading loading-spinner loading-sm"></span>
                                            : !otpSent ? "Send OTP" : "OTP Sent"}
                                    </button>
                                </div>
                            </fieldset>

                            {otpSent && <fieldset className="fieldset">
                                <label className="label">OTP (6 digits)</label>
                                <label className="otp">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <input type="text" autoComplete="one-time-code"
                                        inputMode="numeric" maxLength="6"
                                        pattern="[0-9]{6}" required disabled={!otpSent}
                                        value={otp}
                                        onChange={(event) => {
                                            setOtp(event.target.value.replace(/\D/g, ""));
                                            if (submitError) setSubmitError("");
                                        }}
                                    />
                                </label>
                            </fieldset>}

                            {submitError && (
                                <div className="alert alert-error mt-1" role="alert">
                                    <span>{submitError}</span>
                                </div>
                            )}

                            {otpSent && <button
                                className="btn btn-primary mt-1"
                                type="submit"
                                disabled={!otpSent || isVerifyingOtp}>
                                {isVerifyingOtp
                                    ? <span className="loading loading-spinner loading-sm"></span>
                                    : "Verify OTP"}
                            </button>}
                        </form>}

                        {otpVerified && <form className="fieldset w-xs p-4"
                            onSubmit={handleSubmit}>
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
                                        if (passwordError) validatePassword(value);
                                    }}
                                    onBlur={(event) => validatePassword(event.target.value)}
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
                        </form>}
                    </div>
                </div>
            </div>
        </>
    );
}
export default ResetPasswordViaOtp;
