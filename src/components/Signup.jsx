import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import ageCalc from "../utils/ageCalc";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}$/;

const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailId, setEmailId] = useState("");
    const [emailIdError, setEmailIdError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [dobError, setDobError] = useState("");
    const [submitError, setSubmitError] = useState("");
    

    const validateName = (value, name) => {
        const trimmedValue = value.trim();
        
        // Validate based on required, minLength, and maxLength
        const error = !trimmedValue
            ? "Required"
            : trimmedValue.length < 3
                ? "Must be at least 3 characters."
                : trimmedValue.length > 30
                    ? "Cannot exceed 30 characters."
                    : "";

        if (name === "firstName") {
            setFirstNameError(error);
        } else {
            setLastNameError(error);
        }
        
        return !error;
    };

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

    const validateDob = (value) => {
        // console.log(value); //2026-09-22 (yyyy-mm-dd)

        let error = "";
        if (!value) {
            error = "Required";
        } else {
            let age = ageCalc(value);

            // Validate against Mongoose schema constraints
            if (age < 18) {
                error = "You must be at least 18 years old.";
            } else if (age > 100) {
                error = "Age cannot exceed 100 years.";
            }else{
                setAge(age);
            }
        }

        setDobError(error);
        return !error;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isFirstNameValid = validateName(firstName, "firstName")
        const isLastNameValid = validateName(lastName, "lastName")
        const isEmailValid = validateEmail(emailId);
        const isPasswordValid = validatePassword(password);
        const isPasswordMatched = compareConfirmPassword(confirmPassword);
        const isDobValid = validateDob(dob);

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isPasswordMatched || !isDobValid) return;

        setSubmitError("");

        try{
            // await fetch("/api/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ emailId, password }),
            // });

            const res = await axiosInstance.post(
                "/auth/signup", 
                { firstName, lastName, emailId, password, dob, age }
            );
            // console.log(res)

            if(res.data.success){
                toast.success(`${res.data?.message || "User signed up successfully."}`);
                
                // pass state if you want to pre-fill their email on the login page
                navigate("/login", { state: { emailId: emailId } });
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
                            SIGN UP @DevTinder
                        </h2>

                        <form className="fieldset w-xs p-4"
                            onSubmit={handleSubmit}>
                            <fieldset className="fieldset">
                                <label className="label">First Name</label>
                                <input
                                    type="text"
                                    className="input validator"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setFirstName(value);
                                        if (submitError) setSubmitError("");
                                        if (firstNameError) validateName(value, "firstName");
                                    }}
                                    onBlur={(event) => validateName(event.target.value, "firstName")}
                                    aria-invalid={Boolean(firstNameError)}
                                />
                                {firstNameError && <p className="validator-hint my-0">{firstNameError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Last Name</label>
                                <input
                                    type="text"
                                    className="input validator"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setLastName(value);
                                        if (submitError) setSubmitError("");
                                        if (lastNameError) validateName(value, "lastName");
                                    }}
                                    onBlur={(event) => validateName(event.target.value, "lastName")}
                                    aria-invalid={Boolean(lastNameError)}
                                />
                                {lastNameError && <p className="validator-hint my-0">{lastNameError}</p>}
                            </fieldset>

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
                                {emailIdError && <p className="validator-hint my-0">{emailIdError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Password</label>
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
                                {passwordError && <p className="validator-hint my-0">{passwordError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Confirm Password</label>
                                <input 
                                    type="text" 
                                    className="input validator" 
                                    placeholder="Confirm Password" 
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

                            <fieldset className="fieldset mb-3">
                                <label className="label">Date Of Birth</label>
                                <input 
                                    type="date" 
                                    className="input validator" 
                                    onChange={(event)=>{
                                        const value = event.target.value;
                                        setDob(value);
                                        if(submitError) setSubmitError("");
                                        if(dobError) validateDob(value);
                                    }}
                                    onBlur={(event) => {
                                        validateDob(event.target.value)
                                    }}
                                    aria-invalid={Boolean(dobError)}
                                />
                                {dobError && <p className="validator-hint my-0">{dobError}</p>}
                            </fieldset>

                            {submitError && (
                                <div className="alert alert-error mt-1" role="alert">
                                    <span>{submitError}</span>
                                </div>
                            )}
                            <button className="btn btn-primary mt-1" type="submit">Sign Up</button>
                            <p className="text-center">Have an account? <Link className="mt-1 text-primary" to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Signup;
