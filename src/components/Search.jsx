import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import UserCard from "./UserCard"; // Use your existing card component!
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import RequiredModal from "./RequiredModal";
import { handleApiError } from "../utils/errorHandler";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [searchRun, setSearchRun] = useState(0);
    const [results, setResults] = useState([]);
    const [resultQuery, setResultQuery] = useState("");
    const [loading, setLoading] = useState(Boolean(query.trim()));
    const isEmailVerified = useSelector((store) => store.user.data?.isEmailVerified);
    const isProfileComplete = useSelector((store) => store.user.data?.isProfileComplete);

    const [modalName, setModalName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) return undefined;

        let isActive = true;
        const fetchResults = async () => {
            try {
                const res = await axiosInstance.get("/user/search", {
                    params: { q: normalizedQuery },
                });
                if (isActive) {
                    setResults(res.data?.data || []);
                    setResultQuery(normalizedQuery);
                }
            } catch (err) {
                if (isActive) handleApiError(err);
            } finally {
                if (isActive) setLoading(false);
            }
        };

        fetchResults();
        return () => {
            isActive = false;
        };
    }, [query, searchRun]);

    const handleSearch = (e) => {
        e.preventDefault();
        const nextQuery = new FormData(e.currentTarget).get("q")?.toString().trim() || "";
        const nextParams = new URLSearchParams(searchParams);

        if (nextQuery) {
            nextParams.set("q", nextQuery);
            setLoading(true);
        } else {
            nextParams.delete("q");
            setLoading(false);
        }

        setSearchParams(nextParams);
        setSearchRun((run) => run + 1);
    };

    const cardBtnsConfig = [
        {
            color:"primary",
            text:"Ignore",
            fn: (result) => handleRequest("ignored", result._id),
            disabled: false
        },
        {
            color:"secondary",
            text:"Interested",
            fn: (result) => handleRequest("interested", result._id),
            disabled: false
        }
    ];

    const handleRequest = async (reqStatus, reqId) => {
        if (!isEmailVerified) {
            setModalName("verifyEmail")
            setIsModalOpen(true);
            return;
        }

        if (!isProfileComplete) {
            setModalName("completeProfile")
            setIsModalOpen(true);
            return;
        }

        try{
            const res = await axiosInstance.post(`/request/review/${reqStatus}/${reqId}`);
            if(res.data.success){
                toast.success(res.data.message || `Connection request ${reqStatus}.`);
                // getRequests(1);
            }
        } catch (err) {
            handleApiError(err);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center my-10 h-[calc(70vh)] overflow-y-auto">
                {/* <h1 className="text-3xl font-bold mb-6">Find Connections</h1> */}
                
                <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md px-4">
                    <input
                        key={query}
                        name="q"
                        type="search"
                        placeholder="Search by name (e.g. Dishant)" 
                        className="input input-bordered w-full" 
                        defaultValue={query}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "..." : "Search"}
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-6 px-4 pb-10">
                    {resultQuery === query.trim() && results.length > 0 ? (
                        // results.map((user) => (
                            // <UserCard key={user._id} user={user} />
                            <UserCard 
                                users={results}
                                hasMore={false}
                                isLoadingMore={false}
                                onLoadMore={null}
                                btnsArr={cardBtnsConfig}
                            />
                            // <UserCard 
                            //     users={modifiedConnectionsList} 
                            //     hasMore={hasMore}
                            //     isLoadingMore={isLoadingMore}
                            //     onLoadMore={handleLoadMore}
                            //     btnsArr={cardBtnsConfig}
                            // />
                        // ))
                    ) : (
                        query && !loading && resultQuery === query.trim() && <p className="text-gray-500">No users found.</p>
                    )}
                </div>
            </div>
            <RequiredModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalName={modalName}
            />
        </>
    );
};

export default Search;