import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from '../store/useAuthStore'
import { validate } from "email-validator"
import toast from 'react-hot-toast' // ✅ toast import
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Email_address = () => {
  const [email, setemail] = useState("")
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handlechange = (e) => {
    setemail(e.target.value)
  }

  const save_email = async () => {
    if (!email) {
      toast.error("Enter your email")
      return
    }

    if (!validate(email)) {
      toast.error("Invalid email format")
      return
    }

    localStorage.setItem("email", email)

    try {
      NProgress.start();
      const res = await axiosInstance.post("/auth/emailaddress", { email })
      await user(res.data)
      toast.success("Email sent successfully!")
      setemail("")
      NProgress.done();
      navigate("/emailverification")
    } catch (error) {
      console.log(error?.response?.data?.message)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
    NProgress.done();
  }

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-[url('/background_Image.png')] bg-cover">
        <div className='w-72 h-fit flex-col my-auto sm:w-96 flex bg-slate-300 rounded-md p-5'>
          <h2 className='mt-3 text-center font-bold text-2xl'>Creative Threads</h2>
          <h4 className='mt-3 text-center font-medium text-xl'>Find your Account</h4>
          <p className='mt-3 mb-4 font-normal'>Enter your email address</p>
          <div className='relative mb-1'>
            <span className='fixed -mt-3 ml-1.5 bg-slate-300 w-20 text-center text-blue-700'>Enter Email</span>
            <input
              type="text"
              value={email}
              onChange={handlechange}
              className='w-full h-10 pl-2 border-2 border-blue-700 outline-none'
            />
          </div>

          <div className='flex justify-between h-8 mt-6'>
            <button
              onClick={() => navigate("/signup")}
              className='text-blue-700 font-medium cursor-pointer'>
              Create Account
            </button>
            <button
              onClick={save_email}
              className='bg-blue-700 font-medium text-white text-center cursor-pointer w-20 rounded-md'>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Email_address
