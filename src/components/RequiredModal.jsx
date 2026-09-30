import { Link } from "react-router-dom";

const modal = {
    "verifyEmail" : {
        titleId: "email-verification-title",
        title: "Verify your email",
        bodyText: "Verify your email address before sending, accepting, or rejecting connection requests."
    },
    "completeProfile" : {
        titleId: "complete-profile-title",
        title: "Complete your profile",
        bodyText: "Complete your profile before sending, accepting, or rejecting connection requests."
    }
}

const RequiredModal = ({ isOpen, onClose, modalName }) => {

    if (!isOpen) return null;

    return (
        <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby={modal[modalName]?.titleId}>
            <div className="modal-box">
                <h2 id={modal[modalName]?.titleId} className="text-lg font-bold">{modal[modalName]?.title}</h2>
                <p className="py-4">
                    {modal[modalName]?.bodyText}
                </p>
                <div className="modal-action">
                    <button className="btn" type="button" onClick={onClose}>Cancel</button>
                    <Link className="btn btn-primary" to="/profile" onClick={onClose}>
                        Go to Profile
                    </Link>
                </div>
            </div>
            <button className="modal-backdrop" type="button" aria-label="Close" onClick={onClose} />
        </div>
    );
};

export default RequiredModal;
