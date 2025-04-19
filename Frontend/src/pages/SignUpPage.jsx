import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { validate } from "email-validator";
import toast from "react-hot-toast"; // ✅ toast import
import { socket } from "../lib/socket";

const SignUp = () => {
  const [signup, setsignup] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, seterror] = useState("");

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const signup_handlechange = (e) => {
    setsignup({ ...signup, [e.target.name]: e.target.value });
  };

  const savesignup = async () => {
    if (!validate(signup.email)) {
      // seterror("invalid email")
      return;
    }
    localStorage.setItem("email", signup.email);
    try {
      const res = await axiosInstance.post("/auth/signup", signup);
      await user(res.data);
      toast.success("Signup successful! Redirecting...");
      setsignup({ username: "", email: "", password: "", role: "" });
      navigate("/emailverification");
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message) {
        seterror(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-[url('/background_Image.png')]  bg-cover">
        <div className="w-72  h-fit sm:w-96 ">
          <h2 className="mt-3 text-center font-bold text-2xl text-white">
            Creative Threads
          </h2>
          <p className="my-2 text-center font-thin text-white">
            {" "}
            A Thread that Connect Creativity
          </p>
          <div className="flex flex-col bg-slate-300 rounded-md  h-fit">
            <div className="flex flex-row mb-3 h-10 w-full">
              <div
                className={
                  "text-center font-semibold  w-1/2  pt-1 cursor-pointer"
                }
                onClick={() => navigate("/login")}
              >
                Login
              </div>
              <div
                className={
                  "text-center font-semibold w-1/2 pt-1 border-b-2 border-black cursor-pointer"
                }
              >
                Sign Up
              </div>
            </div>
            <label className="pl-4 mb-1 font-semibold">UserName</label>
            <input
              className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
              type="text"
              required
              value={signup.username}
              onChange={signup_handlechange}
              name="username"
            />
            <label className="pl-4   mb-1 font-semibold">Email</label>
            <input
              className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
              type="text"
              required
              value={signup.email}
              onChange={signup_handlechange}
              name="email"
            />
            <label className="pl-4 mb-1 font-semibold ">Password</label>
            <input
              className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2"
              type="password"
              required
              value={signup.password}
              onChange={signup_handlechange}
              name="password"
            />
            <label className="pl-4 mb-1 font-semibold ">Account Type</label>
            <select
              value={signup.role}
              name="role"
              required
              onChange={signup_handlechange}
              className="rounded-md mx-4 mb-2 p-1 font-normal bg-white outline-none"
            >
              <option value="">Account Type</option>
              <option value="normal"> User</option>
              <option value="artist">Artist</option>
            </select>
            {/* {error && <p className='pl-4 mb-1 text-red-600 text-xs'>{error}</p>} */}

            <button
              className="bg-black mx-4 rounded-md text-white h-8 mb-4 cursor-pointer"
              onClick={savesignup}
            >
              SignUp
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
