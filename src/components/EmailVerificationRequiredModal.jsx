import { Link } from "react-router-dom";

const EmailVerificationRequiredModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="email-verification-title">
            <div className="modal-box">
                <h2 id="email-verification-title" className="text-lg font-bold">Verify your email</h2>
                <p className="py-4">
                    Verify your email address before sending, accepting, or rejecting connection requests.
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

export default EmailVerificationRequiredModal;
