import { useDispatch, useSelector } from "react-redux";
import { setEmailServiceNotice } from "../utils/emailServiceNoticeSlice";

const EmailServiceNotice = () => {
    const noticeValue = useSelector((store) => store.emailServiceNotice);
    const dispatch = useDispatch();

    if (!noticeValue) return null;

    return (
        <div className="fixed top-4 left-1/2 z-50 w-[min(90%,42rem)] -translate-x-1/2" role="alert">
            <div className="alert alert-info shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{noticeValue}</span>
                <div>
                    <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => dispatch(setEmailServiceNotice(""))}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailServiceNotice;
