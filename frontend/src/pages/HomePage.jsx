import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";

import RecommendedUser from "../components/RecommendedUser";
import ShowPost from "../components/ShowPost";
import { Users } from "lucide-react";

const HomePage = ({ filterbyname }) => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/suggestions");
      return res.data;
    },
  });

  console.log('rrcommened', recommendedUsers)

  const { data: posts , isLoading, error} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/all");
      return res.data;
    },
  });

  if (isLoading) return <h2 className="text-center text-blue-500 font-bold">LOADING...</h2>;
 if(error) return <h2 className="text-center text-red-500 font-bold">PAGE NOT FOUND</h2>
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />

        {posts
          ?.filter((post) => {
            return filterbyname?.toLowerCase() === ""
              ? post
              : post?.author.name?.toLowerCase().includes(filterbyname);
          })
          ?.map((post) => (
            <ShowPost key={post._id} post={post} />
          ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
