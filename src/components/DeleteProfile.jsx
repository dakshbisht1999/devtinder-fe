// components/ProfileSettings.jsx
import { useState } from "react";
import axiosInstance from "../utils/axios";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { clearAuthenticatedSession } from "../utils/authSession";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";

export default function DeleteProfile({ modalConfig }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This function links the UI to your utility function
  const handleDeleteConfirm = async () => {
    
    setIsDeleting(true);

    try{
      const res = await axiosInstance.delete(
        "/profile/delete"
      );

      if(res.data.success){
        // Call the delete api
        clearAuthenticatedSession();
        dispatch(removeUser());
        toast.success(`${res.data?.message || "User profile deleted successfully."}`);

        // Close the modal on success
        document.getElementById("delete_confirm_modal").close();
        
        // (Optional) Redirect the user to the homepage or login screen
        navigate("/login");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

    const { type, color, text } = modalConfig.trigger;
    const {title, body, btn1, btn2} = modalConfig.modal;
    const isButton = type === "button";
    // Determine the tag and classes dynamically
    const Component = isButton ? "button" : "span";
    const className = isButton ? `btn btn-${color}` : `text-${color} cursor-pointer hover:underline`;

  return (
    <div>
      {/* Trigger Button */}
        <Component
            className={className}
            onClick={() => document.getElementById("delete_confirm_modal").showModal()}
        >
            {text}
        </Component>

      {/* Modal Dialog */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">{title}</h3>
          <p className="py-4">
            {body}
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" disabled={isDeleting}>{btn1}</button>
            </form>
            
            {/* Link the onClick to your handler function */}
            <button 
              className="btn btn-error" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Processing..." : `${btn2}`}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button disabled={isDeleting}>close</button>
        </form>
      </dialog>
    </div>
  );
}