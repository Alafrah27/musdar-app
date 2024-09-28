import { useQuery } from "@tanstack/react-query";
import RecommendedUser from "../components/RecommendedUser";
import { axiosInstance } from "../lib/axios";

function RecommendedForSmallPhons() {
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/suggestions");
      return res.data;
    },
  });
  console.log(recommendedUsers);
  return (
    <div className=" sm:block lg:hidden col-span-1 lg:col-span-1">
      <div className="bg-secondary rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">People you may know</h2>
        {recommendedUsers?.map((user) => (
          <RecommendedUser key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedForSmallPhons;
