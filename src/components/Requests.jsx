import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/errorHandler";
import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { addRequests, appendRequests } from "../utils/requestsSlice";

const Requests = () => {

    const requests = useSelector((store)=>store.requests);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const hasRequestedInitialConnections = useRef(false);

    const getRequests = useCallback(async (page, shouldAppend = false) => {
        if (shouldAppend) {
            setIsLoadingMore(true);
        } else {
            setIsInitialLoading(true);
        }

        try {
            const res = await axiosInstance.get("/user/requests/received", {
                // Swiped profiles are removed from the server's feed. Always
                // start at the first remaining profile so `skip` never skips
                // an unseen profile after the total count changes.
                params: { limit: 10, page },
            });

            if (res.data.success) {
                dispatch(shouldAppend ? appendRequests(res.data.data) : addRequests(res.data.data));
                setCurrentPage(res.data.pagination?.currentPage ?? page);
                setHasMore(res.data.pagination?.hasMore === true);
            }
        } catch (err) {
            handleApiError(err);
        } finally {
            if (shouldAppend) {
                setIsLoadingMore(false);
            } else {
                setIsInitialLoading(false);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        // Prevent React Strict Mode from requesting the first page twice in development.
        if (hasRequestedInitialConnections.current) return;

        hasRequestedInitialConnections.current = true;
        getRequests(1);
    }, [getRequests]);

    const handleLoadMore = () => {
        // console.log(currentPage)
        if (!hasMore || isLoadingMore) return;
        getRequests(currentPage + 1, true);
    };

    if (isInitialLoading) {
        return (
            <Loader />
        );
    }

    if (!requests.length && !hasMore) {
        return <p className="mt-10 text-center">No more requests to show.</p>;
    }

    const modifiedRequestsList = [];
    requests.map((request)=>{
        const {_id, toUserId, status, createdAt, updatedAt, __v} = request;
        modifiedRequestsList.push({
            ...request.fromUserId,
            fromUserId: request.fromUserId._id,
            _id, toUserId, status, createdAt, updatedAt, __v
        })
    })

    const rejectRequest = (req) => {
        handleRequest("rejected", req._id);
    }
    const acceptRequest = (req) => {
        handleRequest("accepted", req._id);
    }

    const cardBtnsConfig = [
        {
            color:"primary",
            text:"Reject",
            fn: rejectRequest,
            disabled: false
        },
        {
            color:"secondary",
            text:"Accept",
            fn: acceptRequest,
            disabled: false
        }
    ];

    const handleRequest = async (reqStatus, reqId) => {
        try{
            const res = await axiosInstance.post(`/request/review/${reqStatus}/${reqId}`);
            if(res.data.success){
                toast.success(res.data.message || `Connection request ${reqStatus}.`);
                getRequests(1);
            }
        } catch (err) {
            handleApiError(err);
        }
    }

    return (
        <>
            <UserCard 
                users={modifiedRequestsList} 
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                btnsArr={cardBtnsConfig}
            >
            </UserCard>
        </>
    )
}

export default Requests