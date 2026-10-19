import { useFollowUser } from "../../Hooks/useFollowUser";
import { useSuggestedUsers } from "../../Hooks/useSuggestedUsers";
import FollowButton from "../FollowButton/FollowButton";

;

export default function AllSuggestedUsers() {
    const {
        data,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSuggestedUsers();
    const {
        mutate: followUser,
        
        variables,
    } = useFollowUser();
    const users =
        data?.pages.flatMap((page) => page.data.suggestions) ?? [];

    if (isPending) return <p>Loading suggested users...</p>;
    if (isError) return <p>Failed to load suggested users.</p>;

    return (
        <main className="mx-auto max-w-3xl p-4">
            <h1 className="mb-2 text-2xl font-bold">
                Suggested for you
            </h1>
            <p className="mb-6 text-sm text-gray-500">
                Discover people you may know.
            </p>

            <div className="space-y-3">
                {users.map((user) => {
                    const isThisUserPending =
                        isPending && variables?.userId === user._id;
                    return (
                        <div key={user._id} className="flex items-center gap-3 rounded-xl border p-3">
                            <img src={user.photo} alt={user.name} className="h-12 w-12 rounded-full object-cover" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">{user.name}</p>
                                <p className="truncate text-sm text-gray-500">
                                    @{user.username}
                                </p>
                            </div>
                            <FollowButton isThisUserPending={isThisUserPending} followUser={followUser} user={user} />
                            {/* <button className="shrink-0 rounded-full border border-blue-500 px-3 py-2 text-sm text-blue-600">
                            Follow
                        </button> */}
                        </div>
                    )
                })}


            </div>

            {hasNextPage && (
                <button onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-6 w-full rounded-full border border-blue-500 px-4 py-3 font-medium text-blue-600
        disabled:opacity-50"
                >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
            )}
        </main>
    );
}