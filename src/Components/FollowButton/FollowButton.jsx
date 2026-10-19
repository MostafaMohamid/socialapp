

export default function FollowButton({ user, isThisUserPending, followUser }) {
    return (
        <button
            disabled={isThisUserPending}
            onClick={() =>
                followUser({
                    userId: user._id,
                    isFollowing: false,
                })
            }
            className="shrink-0 rounded-full border border-blue-500 px-3 py-2 text-sm text-blue-600  ">
            {isThisUserPending ? "Loading..." : "Follow"}
        </button>
    )
}
