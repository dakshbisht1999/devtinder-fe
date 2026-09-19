import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { addConnections, appendConnections } from "../utils/connectionsSlice";
import { handleApiError } from "../utils/errorHandler";
import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import Loader from "./Loader";
import { toast } from "react-toastify";

const Connections = () => {

    const connections = useSelector((store)=>store.connections);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const hasRequestedInitialConnections = useRef(false);
    const [connectionDetail, setConnectionDetail] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const getConnections = useCallback(async (page, shouldAppend = false) => {
        if (shouldAppend) {
            setIsLoadingMore(true);
        } else {
            setIsInitialLoading(true);
        }

        try {
            const res = await axiosInstance.get("/user/connections", {
                // Swiped profiles are removed from the server's feed. Always
                // start at the first remaining profile so `skip` never skips
                // an unseen profile after the total count changes.
                params: { limit: 10, page },
            });

            if (res.data.success) {
                dispatch(shouldAppend ? appendConnections(res.data.data) : addConnections(res.data.data));
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
        getConnections(1);
    }, [getConnections]);

    const handleLoadMore = () => {
        // console.log(currentPage)
        if (!hasMore || isLoadingMore) return;
        getConnections(currentPage + 1, true);
    };

    if (isInitialLoading) {
        return (
            <Loader />
        );
    }

    if (!connections.length && !hasMore) {
        return <p className="mt-10 text-center">No more connections to show.</p>;
    }

    const modifiedConnectionsList = [];
    connections.map((connection)=>{
        modifiedConnectionsList.push({
            ...connection.friendProfile,
            friendId: connection.friendId,
            connectionUpdatedAt: connection.updatedAt,
            _id: connection._id
        })
    })

    const removeConnection = (connection) => {
        // console.log(connection)
        setConnectionDetail(connection);
        document.getElementById("remove_connection_modal").showModal();
    }

    const cardBtnsConfig = [
        {
            color:"error text-white",
            text:"Remove Connection",
            fn: removeConnection,
            disabled: false
        }
    ];

    const handleRemoveConfirm = async () => {
        setIsRemoving(true);
        // console.log(connectionDetail._id);
        try{
            const res = await axiosInstance.delete(`/user/connection/remove/${connectionDetail._id}`);
            if(res.data.success){
                setIsRemoving(false);
                document.getElementById("remove_connection_modal").close();
                toast.success(res.data.message || "Connection removed successfully.");
                setConnectionDetail(null);
                getConnections(1);
            }
        } catch (err) {
            handleApiError(err);
            setIsRemoving(false);
        }
    }

    return (
        <>
            <UserCard 
                users={modifiedConnectionsList} 
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                btnsArr={cardBtnsConfig}
            >
            </UserCard>

            <dialog id="remove_connection_modal" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-lg text-error">Remove Connection</h3>
                <p className="py-4">
                    Want to remove {connectionDetail?.firstName}?
                </p>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn" disabled={isRemoving}>Close</button>
                    </form>
                    <button 
                        className="btn btn-error text-white" 
                        onClick={()=>handleRemoveConfirm()}
                        disabled={isRemoving}
                        >
                        {isRemoving ? "Processing..." : "Remove"}
                    </button>
                </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button disabled={isRemoving}>close</button>
                </form>
            </dialog>
        </>
    )
}

export default Connections