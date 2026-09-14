import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ users }) => {
    const dispatch = useDispatch();
    const [pendingUserId, setPendingUserId] = useState(null);
    const [swipeDirection, setSwipeDirection] = useState(null);

    const handleRequest = async (status, userId) => {
        setPendingUserId(userId);

        try {
            const response = await axiosInstance.post(`/request/send/${status}/${userId}`);

            if (response.data.success) {
                setSwipeDirection(status);
                await new Promise((resolve) => setTimeout(resolve, 500));
                dispatch(removeUserFromFeed(userId));
                toast.success(response.data.message || "Request sent successfully.");
            } else {
                toast.error(response.data.message || "Unable to send request. Please try again.");
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setPendingUserId(null);
            setSwipeDirection(null);
        }
    };

    return (
        <div className="flex justify-center p-6 flex-1 w-full">
            <div className="stack stack-bottom w-96 max-w-full">
                {users.slice(0, 3).map((user, index) => {
                    const isPending = pendingUserId === user._id;
                    const isTopCard = index === 0;
                    const swipeClasses = isTopCard && swipeDirection === "ignored"
                        ? "-translate-x-[120%] -rotate-12 opacity-0 !bg-error/40"
                        : isTopCard && swipeDirection === "interested"
                            ? "translate-x-[120%] rotate-12 opacity-0 !bg-success/40"
                            : "";

                    return (
                        <div
                            key={user._id}
                            className={`card border border-base-content/20 bg-base-300 shadow-sm transition-all duration-500 ease-in-out ${isTopCard ? "" : "pointer-events-none"} ${swipeClasses}`}>
                            <figure>
                                <img
                                    className="h-72 object-contain"
                                    src={user.photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                                    alt={`${user.firstName}'s profile`}
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{user.firstName} {user.lastName}</h2>
                                {user.age && <p>{user.age} years old</p>}
                                <p>{user.about || "No bio added yet."}</p>
                                {user.skills?.length > 0 && <p>Skills: {user.skills.join(", ")}</p>}
                                {isTopCard && <div className="card-actions">
                                    <button
                                        className="btn btn-primary"
                                        disabled={isPending}
                                        onClick={() => handleRequest("ignored", user._id)}>
                                        Ignore
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        disabled={isPending}
                                        onClick={() => handleRequest("interested", user._id)}>
                                        Interested
                                    </button>
                                </div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserCard;
