import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import ageCalc from "../utils/ageCalc";
import { addUser } from "../utils/userSlice";
import DeleteSettings from "./DeleteProfile";

const EditProfile = () => {
    const user = useSelector((store) => store.user.data);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState(user.firstName);
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState(user.lastName);
    const [lastNameError, setLastNameError] = useState("");
    const [emailId] = useState(user.emailId);
    const [age, setAge] = useState(user.age);
    const [dob, setDob] = useState(user.dob);
    const [dobError, setDobError] = useState("");
    const [gender, setGender] = useState(user.gender);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [photoUrlError, setPhotoUrlError] = useState("");
    const [about, setAbout] = useState(user.about);
    const [aboutError, setAboutError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const allowedGender = ["male","female","others"];
    const [skills, setSkills] = useState(user.skills);
    const deleteProfileModalConfig = {
        trigger: {
            type: "text",
            color: "error",
            text: "Click here!"
        },
        modal:{
            title: "Confirm Deletion",
            body: "Are you absolutely sure you want to delete your profile?",
            btn1: "Cancel",
            btn2: "Yes, Delete"
        }
    }
    

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

    const validatePhotoUrl = (value) => {
        let error = "";

        try {
            const parsedUrl = new URL(value);
            
            // Validate against protocol constraints (only allow standard web links)
            if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
                error = "URL must start with http:// or https://";
            }
        } catch {
            // new URL() throws an error if the string is completely invalid
            error = "Please enter a valid URL.";
        }
        

        // Update your error state for the UI
        setPhotoUrlError(error); 
        
        // Returns true if there is no error (valid), false if there is an error (invalid)
        return !error; 
    };

    const validateAbout = (value) => {
        const trimmedValue = value.trim();
        
        // Validate based on required, minLength, and maxLength
        const error = !trimmedValue
            ? "Required"
            : trimmedValue.length < 30
                ? "Must be at least 30 characters."
                : trimmedValue.length > 500
                    ? "Cannot exceed 500 characters."
                    : "";

        setAboutError(error);
        return !error;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(skills)

        const isFirstNameValid = validateName(firstName, "firstName")
        const isLastNameValid = validateName(lastName, "lastName")
        const isDobValid = validateDob(dob);
        const isPhotoUrlValid = validatePhotoUrl(photoUrl);
        const isAboutValid = validateAbout(about);

        if (!isFirstNameValid || !isLastNameValid || !isDobValid || !isPhotoUrlValid || !isAboutValid) return;
        // Send only actual changes. In particular, an empty or invalid optional
        // value must not overwrite the currently saved gender or skills.
        const updateData = {};
        const addChangedField = (key, value) => {
            if (value !== user[key]) updateData[key] = value;
        };

        addChangedField("firstName", firstName);
        addChangedField("lastName", lastName);
        addChangedField("photoUrl", photoUrl);
        addChangedField("about", about);

        if (dob !== user.dob) {
            updateData.dob = dob;
            updateData.age = ageCalc(dob);
        }

        if (allowedGender.includes(gender) && gender !== user.gender) {
            updateData.gender = gender;
        }

        const validSkills = Array.isArray(skills)
            ? skills.map((skill) => skill.trim()).filter(Boolean)
            : [];
        const savedSkills = Array.isArray(user.skills) ? user.skills : [];
        if (validSkills.length > 0 && JSON.stringify(validSkills) !== JSON.stringify(savedSkills)) {
            updateData.skills = validSkills;
        }

        setSubmitError("");

        if (Object.keys(updateData).length === 0) {
            toast.info("No profile changes to save.");
            return;
        }

        try{
            const res = await axiosInstance.patch(
                "/profile/edit", 
                updateData
            );

            if(res.data.success){
                dispatch(addUser({ ...user, ...updateData }));
                toast.success(`${res.data?.message || "Profile updated successfully."}`);
            }
        } catch (err) {
            // Signup errors belong beside the form, so do not also show a toast.
            setSubmitError(handleApiError(err, { notify: false }));
        }
    };

    // The preview intentionally uses the draft form values, not the saved
    // Redux user, so it reflects edits before the profile is submitted.
    const reviewUser = {
        ...user,
        firstName,
        lastName,
        age,
        dob,
        gender,
        photoUrl,
        about,
        skills,
    };

    return (
        <div className="flex flex-wrap justify-center my-20">
            <div className="flex justify-center items-center mx-10">
                <div className="card bg-base-300 w-96 shadow-sm ">
                    {/* <figure>
                        <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes" />
                    </figure> */}
                    <div className="card-body">
                        <h2 className="card-title flex justify-center">
                            Edit Profile
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
                                    className="input bg-base-300 cursor-not-allowed disabled"
                                    placeholder="Email"
                                    value={emailId}
                                    readOnly
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Age</label>
                                <input
                                    type="number"
                                    className="input bg-base-300 cursor-not-allowed disabled"
                                    placeholder="Age"
                                    value={age}
                                    readOnly
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Date Of Birth</label>
                                <input 
                                    type="date" 
                                    className="input validator" 
                                    value={dob}
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

                            <fieldset className="fieldset">
                                <label className="label">Gender</label>
                                <select 
                                    className="select" 
                                    value={gender || "Pick a Gender"} // Use 'value' instead of 'defaultValue' to track state updates
                                    onChange={(event) => {
                                        const value = event.target.value; 
                                        setGender(value);
                                    }}
                                >
                                    <option value="">Pick a Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Photo URL</label>
                                <input
                                    type="text"
                                    className="input validator"
                                    placeholder="Photo URL"
                                    value={photoUrl}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setPhotoUrl(value);
                                        if (submitError) setSubmitError("");
                                        if (photoUrlError) validatePhotoUrl(value);
                                    }}
                                    onBlur={(event) => validatePhotoUrl(event.target.value)}
                                    aria-invalid={Boolean(photoUrlError)}
                                />
                                {photoUrlError && <p className="validator-hint my-0">{photoUrlError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">About</label>
                                <textarea
                                    className="textarea h-24 validator"
                                    placeholder="About"
                                    value={about}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setAbout(value);
                                        if (submitError) setSubmitError("");
                                        if (aboutError) validateAbout(value);
                                    }}
                                    onBlur={(event) => validateAbout(event.target.value)}
                                    aria-invalid={Boolean(aboutError)}
                                ></textarea>
                                {aboutError && <p className="validator-hint my-0">{aboutError}</p>}
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Skills (separate using comma)</label>
                                <textarea
                                    className="textarea h-24"
                                    placeholder="Skills"
                                    value={skills.join(",")}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSkills(value.trim(" ").split(","));
                                    }}
                                ></textarea>
                            </fieldset>

                            {submitError && (
                                <div className="alert alert-error mt-1" role="alert">
                                    <span>{submitError}</span>
                                </div>
                            )}
                            <button className="btn btn-primary mt-1" type="submit">Save Changes</button>
                        </form>
                        <br />
                        <p className="text-center">Want to change your password? <Link className="mt-1 text-primary" to="/resetPassword">Click here!</Link></p>
                        <div className="divider">OR</div>
                        <div className="text-center">Want to delete your profile? 
                            {/* <Link className="mt-1 text-primary" to="/profileSettings">Click here!</Link> */}
                            <DeleteSettings modalConfig={deleteProfileModalConfig} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center m-10">
                <h2 className="card-title flex justify-center">
                    Review
                </h2>
                <UserCard 
                    users={[reviewUser]}
                    hasMore={false}
                    isLoadingMore={false}
                    onLoadMore={null}
                />
            </div>
        </div>
    );
}
export default EditProfile;
