import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Loyout/Layout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import Notifications from "./pages/Notifications";
import NetWorkPagge from "./pages/NetWorkPagge";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import Navbar from "./components/Loyout/Navbar";
import { useState } from "react";
import RecommendedForSmallPhons from "./pages/RecommendedForSmallPhons";

function App() {
  const [filterbyname, setFilterByName] = useState("");
  console.log(filterbyname);
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    },
  });

  if (isLoading) {
    return null;
  }
  return (
    <Layout>
      <Navbar filterbyname={filterbyname} setFilterByName={setFilterByName} />

      {/* The Routes component is used to render the routes. */}
      <Routes>
        {/* The HomePage component is rendered when the user visits the root path. */}
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage
                filterbyname={filterbyname}
                setFilterByName={setFilterByName}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* The SignupPage component is rendered when the user visits the signup path. */}
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/addfriend"
          element={
            authUser ? <RecommendedForSmallPhons /> : <Navigate to="/login" />
          }
        />
        {/* The LoginPage component is rendered when the user visits the login path. */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetWorkPagge /> : <Navigate to="/login" />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
