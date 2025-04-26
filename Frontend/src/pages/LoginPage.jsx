import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { validate } from "email-validator";
import { socket } from "../lib/socket";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Login = () => {
  const [login, setlogin] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { user, checkAuth } = useAuthStore();

  const login_handlechange = (e) => {
    setlogin({ ...login, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Check if credentials were saved
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedEmail && savedPassword) {
      setlogin({ ...login, email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const savelogin = async () => {
    seterror("");

    if (!validate(login.email)) {
      toast.error("Please enter a valid email address.");
      seterror("Invalid email address");
      return;
    }
    try {
      NProgress.start();
      const res = await axiosInstance.post("/auth/login", login);
      // console.log(res);
      const {
        username,
        email,
        _id,
        role,
        profilePic,
        followers,
        following,
        dob,
        country,
        city,
        phone,
        gender,
      } = res.data;

      const userData = {
        username,
        email,
        _id,
        role,
        profilePic,
        followers,
        following,
        dob,
        country,
        city,
        phone,
        gender,
      };

      await user(userData);
      localStorage.setItem("userId", userData._id);
      await checkAuth();
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      toast.success("Login successful!");
      setlogin({ email: "", password: "" });
      NProgress.done();
      navigate("/");

      //   const res = await axiosInstance.post("/auth/login", login)
      //   const data = {
      //     username: res.data.username,
      //     email: res.data.email,
      //     _id: res.data._id,
      //     profilePic: res.data.profilePic,
      //     role: res.data.role,
      //     phone: res.data.phone,
      //     bio:res.data.bio,
      //     arttype:res.data.arttype
      //   }
      //   if (!res.data.emailverification) {
      //     await user(data)
      //     window.location.href = "/emailverification"
      //   } else {
      //     await user(data)
      //     await checkAuth()
      //     navigate("/")
      //   }
      //   setlogin({ email: "", password: "" })
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error?.response?.data?.message ||
        "Login failed. Check your credentials!";
      toast.error(message);
      seterror(message);
    }
    NProgress.done();
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-[url('/background_Image.png')]  bg-cover ">
        <div className="w-72  h-fit  my-auto sm:w-96 ">
          <h2 className="mt-3 text-center font-bold text-2xl text-white">
            Creative Threads
          </h2>
          <p className="my-2 text-center font-thin text-white">
            A Thread that Connects Creativity
          </p>
          <div className="flex flex-col bg-slate-300 rounded-md h-fit">
            <div className="flex flex-row mb-3 h-10 w-full">
              <div className="text-center font-semibold w-1/2 pt-1 border-b-2 border-black cursor-pointer">
                Login
              </div>
              <div
                className="text-center font-semibold w-1/2 pt-1 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </div>
            </div>
            <label className="pl-4 mb-1 font-semibold">Email</label>
            <input
              className="bg-white outline-none rounded-md mx-4 mb-2 pl-2"
              type="text"
              required
              value={login.email}
              onChange={login_handlechange}
              name="email"
            />
            <label className="pl-4 mb-1 font-semibold">Password</label>
            <input
              className="bg-white outline-none rounded-md mx-4 mb-2 pl-2"
              type="password"
              required
              value={login.password}
              onChange={login_handlechange}
              name="password"
            />
            {error && <p className="pl-4 text-red-600 text-xs">{error}</p>}
            <div className="flex flex-row mb-3 w-full justify-between">
              <div className="flex pl-4 text-xs">
                <input type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <p className="pl-1">Remember me</p>
              </div>
              <div
                className="pr-4 text-xs cursor-pointer"
                onClick={() => navigate("/emailaddress")}
              >
                Forget Password
              </div>
            </div>
            <button
              className="bg-black mx-4 rounded-md text-white h-8 mb-4 cursor-pointer"
              onClick={savelogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
