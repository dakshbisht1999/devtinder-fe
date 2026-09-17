import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { addFeed, appendFeed } from "../utils/feedSlice";
import { handleApiError } from "../utils/errorHandler";
import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {


    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();
    const [hasMore, setHasMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const hasRequestedInitialFeed = useRef(false);

    const getFeed = useCallback(async (shouldAppend = false) => {
        if (shouldAppend) {
            setIsLoadingMore(true);
        } else {
            setIsInitialLoading(true);
        }

        try {
            const res = await axiosInstance.get("/user/feed", {
                // Swiped profiles are removed from the server's feed. Always
                // start at the first remaining profile so `skip` never skips
                // an unseen profile after the total count changes.
                params: { limit: 10, page: 1 },
            });

            if (res.data.success) {
                dispatch(shouldAppend ? appendFeed(res.data.data) : addFeed(res.data.data));
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
        if (hasRequestedInitialFeed.current) return;

        hasRequestedInitialFeed.current = true;
        getFeed();
    }, [getFeed]);

    const handleLoadMore = () => {
        if (!hasMore || isLoadingMore) return;
        getFeed(true);
    };

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] w-full">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    if (!feed.length && !hasMore) {
        return <p className="mt-10 text-center">No more profiles to show.</p>;
    }

    return (
        <UserCard
            users={feed}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
        />
    );
};

export default Feed;
