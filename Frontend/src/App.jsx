import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Email_verification from "./pages/Email_verificationPage";
import { useAuthStore } from "./store/useAuthStore";
import SignUp from "./pages/SignUpPage";
import Email_address from "./pages/Email_addressPage";
import { Toaster } from "react-hot-toast";
import PostDetails from "./pages/PostDetailsPage";
import Explore from "./pages/ExplorePage";
import Chat from "./pages/ChatPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";
import CreatePost from "./pages/CreatePostPage"
import Setting from "./pages/SettingPage";
import NotificationPage from "./pages/NotificationPage";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import OtherUserProfile from "./pages/OtherUserProfilePage";
import SearchPage from "./pages/SearchPage";

function App() {
  const { authUser, token, checkAuth, isCheckingAuth } = useAuthStore();
  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]),
  //   console.log({ authUser });

  // if (isCheckingAuth && !authUser)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader className="size-10 animate-spin" />
  //     </div>
  //   );
  // console.log(authUser,token)

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            token && authUser ? <Home /> : <Navigate to="/login" replace:true />
          }
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace:true />}
        />
        <Route
          path="/emailverification"
          element={
            !token && authUser ? (
              <Email_verification />
            ) : (
              <Navigate to="/" replace:true />
            )
          }
        />
        <Route
          path="/signup"
          element={!token ? <SignUp /> : <Navigate to="/" replace:true />}
        />
        <Route
          path="/emailaddress"
          element={
            !token ? <Email_address /> : <Navigate to="/" replace:true />
          }
        />
        <Route
          path="/post/:postId"
          element={
            token && authUser ? (
              <PostDetails />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        />
        <Route
          path="/Explore"
          element={
            token && authUser ? (
              <Explore />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        />
        <Route
          path="/Chat"
          element={
            token && authUser ? <Chat /> : <Navigate to="/login" replace:true />
          }
        />
        <Route
          path="/profile/:id"
          element={
            token && authUser ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/editprofile"
          element={
            token && authUser ? (
              <EditProfile />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        />
        <Route
          path="/createpost"
          element={
            token && authUser ? (
              <CreatePost />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        />
        <Route
          path="/setting"
          element={
            token && authUser ? (
              <Setting />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        />
        {/* <Route
          path="/Notifications"
          element={
            token && authUser ? (
              <NotificationPage />
            ) : (
              <Navigate to="/login" replace:true />
            )
          }
        /> */}

        <Route
          path="/otheruserprofile/:username"
          element={
            token && authUser ? <OtherUserProfile /> : <Navigate to="/login" replace:true />
          }
        />

        <Route
          path="/search"
          element={
            token && authUser ? <SearchPage /> : <Navigate to="/login" replace:true />
          }
        />
      </Routes>

    </>
  );
}

export default App;
