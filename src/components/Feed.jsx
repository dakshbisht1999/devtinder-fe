import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { addFeed } from "../utils/feedSlice";
import { handleApiError } from "../utils/errorHandler";
import { useCallback, useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {


    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/user/feed", {
                params: { limit: 10, page: 1 },
            });

            if (res.data.success) {
                dispatch(addFeed(res.data.data));
            }
        } catch (err) {
            handleApiError(err);
        }
    }, [dispatch]);

    useEffect(() => {
        getFeed();
    }, [getFeed]);

    if (!feed.length) {
        return <p className="mt-10 text-center">No more profiles to show.</p>;
    }

    return <UserCard users={feed} />;
};

export default Feed;
