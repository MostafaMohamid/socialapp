import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import PosrCard from '../PosrCard/PosrCard';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import CreatePostCard from '../../CreatePostCard/CreatePostCard';


export default function Home() {
  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      params: {
        sort: '-createdAt',
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['getPosts'],
    queryFn: getAllPosts,
    select: (res) => res?.data.data.posts,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <h2 className="text-heading">{error?.message || 'Something went wrong'}</h2>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-heading">Home</h1>
        <p className="text-sm text-body">See what people are sharing right now</p>
      </div>

      <CreatePostCard />

      <div className="mt-2 space-y-0">
        {data?.map((post) => (
          <PosrCard key={post._id} Home post={post} />
        ))}
      </div>
    </div>
  );
}
