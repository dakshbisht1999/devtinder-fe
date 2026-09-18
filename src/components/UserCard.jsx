import Loader from "./Loader";

const UserCard = ({ users, hasMore, isLoadingMore, onLoadMore }) => {
    const isTopCard = true;
    // hasMore = true;
    return (
        <div className="flex flex-col justify-center">
            {users.map((user)=>{
                return (
                    <div className="flex py-5" key={user._id}>
                        <div className="card border border-base-content/20 bg-base-300 shadow-sm w-96">
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
                                        // disabled={isPending}
                                        // onClick={() => handleRequest("ignored", user._id)}
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        // disabled={isPending}
                                        // onClick={() => handleRequest("interested", user._id)}
                                    >
                                        Interested
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                )
            })}
            {hasMore && (
                <div className="card border border-base-content/20 bg-base-300 shadow-sm">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">Want to see more?</h2>
                        <p>Load the next set of profiles.</p>
                        <div className="card-actions mt-2">
                            <button
                                className="btn btn-primary min-w-32"
                                disabled={isLoadingMore}
                                onClick={onLoadMore}>
                                {isLoadingMore
                                    ? <Loader />
                                    : "Load more"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCard;
