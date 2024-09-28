import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CircleUserRound, Home, LogOut, User, Users } from "lucide-react";
import { toast } from "react-hot-toast";
function Navbar({ setFilterByName }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),

    enabled: !!authUser,
  });
  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),

    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logout successful");
      navigate("/");
    },
  });
  const unreadNotificationCount = notifications?.data?.filter(
    (n) => !n.isRead
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  // console.log("connection", connectionRequests);
  // console.log("notification", notifications);
  return (
    <nav className="w-[100%] bg-secondary shadow-md sticky top-0 z-10 px-2 mt-[-25px]">
      <div className="max-w-7xl mx-auto sm:px-5">
        <div className="flex items-center justify-between p-2 gap-1">
          <h2 className="text-[14px] text-blue-600 font-bold">MusdarApp</h2>
          <input
            type="text"
            placeholder="Search"
            className=" bg-gray-100 py-2 px-3 rounded-[8px] hover:border-blue-500 focus:outline-none w-[50%]"
            onChange={(e) => setFilterByName(e.target.value)}
          />

          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className=" flex justify-between items-center py-3 mx-auto">
          <div className=" ">
            <h2 className="text-[15px] font-bold">
              {`Welcome, ${authUser?.name} ${authUser?.username}`}
            </h2>
          </div>
          <div className="flex items-center justify-between gap-4 p-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to={"/"}
                  className="text-neutral flex flex-col items-center"
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>

                <Link
                  to={"/addfriend"}
                  className="sm:block lg:hidden text-neutral flex flex-col items-center"
                >
                  <CircleUserRound size={20} />
                  <span className="text-xs hidden md:block">friends</span>
                </Link>

                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                                    rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                                    rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
