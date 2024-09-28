import { Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const { mutate: loginForm, isLoading } = useMutation({
    mutationFn: (userdata) => axiosInstance.post("/auth/login", userdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login SuccessFully ");
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  function handleSubmit(e) {
    e.preventDefault();
    console.log(username, password);
    loginForm({ username, password });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Login"}
        
      </button>
    </form>
  );
}

export default LoginForm;
