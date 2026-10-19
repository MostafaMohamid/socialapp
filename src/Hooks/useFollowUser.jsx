
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";



export function useFollowUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, isFollowing }) => {
            const token = localStorage.getItem("token");

            const response = await axios({
                method: isFollowing ? "DELETE" : "PUT",
                url: `https://route-posts.routemisr.com/users/${userId}/follow`,
                headers: {
                    Authorization: localStorage.getItem("token") ? `Bearer ${token}` : "",
                },
            });

            return response.data;
        },

        onSuccess: () => {
            toast.success("Follow status updated successfully!");
            queryClient.invalidateQueries({
                queryKey: ["suggestedUsers"],
            });
        },
    });
}
