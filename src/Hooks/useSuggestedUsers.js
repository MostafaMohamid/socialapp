import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSuggestedUsers = () => {

    return useInfiniteQuery({
        queryKey: ['suggestedUsers'],
        queryFn: async ({ pageParam = 1 }) => {

            const response = await axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=10&page=${pageParam}`,
                {

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            console.log('response', response.data)
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => 
            lastPage.meta.pagination.nextPage ?? undefined,
        
    });

}