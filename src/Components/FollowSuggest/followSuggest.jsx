import { NavLink } from "react-router-dom";
import { useSuggestedUsers } from "../../Hooks/useSuggestedUsers";
import { useFollowUser } from "../../Hooks/useFollowUser";
import FollowButton from "../FollowButton/FollowButton";

;




export default function FollowSuggest() {
    const {
        mutate: followUser,
        isPending,
        variables,
    } = useFollowUser();
    const { data,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage, } = useSuggestedUsers()

    const suggestedUsersApi = data?.pages?.flatMap(
        (page) => page.data.suggestions
    );


    return (
        // <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm mt-3">
        //     <div className="mb-4 flex items-center justify-between">
        //         <h2 className="text-lg font-semibold text-gray-900">
        //             Suggested for you
        //         </h2>

        //         <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
        //             See all
        //         </button>
        //     </div>

        //     <div className="space-y-4">
        //         {suggestedUsersApi?.map((user) => (
        //             <div key={user.id} className="flex items-center gap-3">
        //                 <img
        //                     src={user.photo}
        //                     alt={user.name}
        //                     className="h-11 w-11 shrink-0 rounded-full object-cover"
        //                 />

        //                 <div className="min-w-0 flex-1">
        //                     <p className="truncate text-sm font-semibold text-gray-900">
        //                         {user.name}
        //                     </p>
        //                     <p className="truncate text-xs text-gray-500">
        //                         {user.username}
        //                     </p>
        //                 </div>

        //                 <button className="shrink-0 rounded-full border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">
        //                     Follow
        //                 </button>
        //             </div>
        //         ))}
        //     </div>
        //     {hasNextPage && (
        //         <button
        //             onClick={() => {fetchNextPage()
        //                 console.log('fetching next page...')
        //             }}
        //             disabled={isFetchingNextPage}
        //             className="mt-5 w-full border-t disabled:text-gray-600 border-gray-100 pt-3 text-sm font-medium text-blue-600 hover:text-blue-700">

        //             {isFetchingNextPage ? 'Loading...' : 'Discover more people'}

        //         </button>)}


        // </aside>
        <div className="flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-(--app-line) bg-(--app-surface)">
            {/* Header stays visible */}
            <div className="flex shrink-0 items-center justify-between p-4">
                <h2 className="text-lg font-semibold text-(--app-ink)">
                    Suggested for you
                </h2>

                <button className="text-sm font-medium text-(--app-sky) hover:text-(--app-sky)/80">
                    <NavLink to="/allSuggestedUsers">
                        See all

                    </NavLink>
                </button>
            </div>

            {/* Users list scrolls independently */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3">
                {suggestedUsersApi?.map((user) => {
                    const isThisUserPending =
                        isPending && variables?.userId === user._id;

                    return (
                        <div
                            key={user._id}
                            className="flex items-center gap-3 py-2"
                        >
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-(--app-ink)">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-(--app-muted)">
                                    {user.username}
                                </p>
                            </div>
                            <FollowButton isThisUserPending={isThisUserPending} followUser={followUser} user={user} />

                            {/* <button
                                disabled={isThisUserPending}
                                onClick={() =>
                                    followUser({
                                        userId: user._id,
                                        isFollowing: false,
                                    })
                                }
                                className="shrink-0 rounded-full border border-blue-500 px-3 py-2 text-sm text-blue-600">
                                {isThisUserPending ? "Loading..." : "Follow"}
                            </button> */}

                        </div>

                    )
                })}
            </div>

            {/* Button stays visible */}
            <div className="shrink-0 border-t border-(--app-line) bg-(--app-surface) p-3">
                <button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className="w-full rounded-lg py-2 text-sm font-medium text-(--app-sky) bg-(--app-surface) hover:bg-(--app-sky)/10 hover:text-(--app-sky)/90 transition-colors duration-200 disabled:opacity-50 border border-(--app-line)"
                >
                    {isFetchingNextPage
                        ? "Loading..."
                        : hasNextPage
                            ? "Discover More"
                            : "No more users"}
                </button>
            </div>
        </div >
    );
}
