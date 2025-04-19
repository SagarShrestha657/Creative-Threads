// import React, { useState } from "react";
// import { axiosInstance } from "../lib/axios";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import { ToastContainer, toast } from 'react-toastify';

// const ChangePassword = () => {
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [changecontent, setchangecontent] = useState(false);
//     const [Error, setError] = useState("");
//     const navigate = useNavigate();
//     const User = useAuthStore((state) => state.authUser)

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (newPassword !== confirmPassword) {
//             setError("New password and confirm password must match.");
//             return;
//         }

//         if (newPassword.length < 6) {
//             setError("New password must be at least 6 characters long.");
//             return;
//         }

//         try {
//             const res = await axiosInstance.post("/auth/changepassword", { newPassword })
//             toast.success(res.data.message)
//             setNewPassword("")
//             setConfirmPassword("")
//         } catch (err) {
//             if (err.response.data.message)
//                 setError(err.response.data.message);
//         }
//     };

//     //code for otp

//     const [code, setcode] = useState("")
//     const [error, seterror] = useState("")


//     const handlechange = (e) => {
//         setcode(e.target.value)
//     }
//     const checkcode = async () => {
//         if (code) {
//             try {
//                 const email = User.email;
//                 await axiosInstance.post("/auth/checkotp", { code, email })
//                 setchangecontent(true)
//             } catch (error) {
//                 console.log(error)
//                 if (error.response.data.message) {
//                     seterror(error.response.data.message)
//                 } else {
//                     seterror("something went wrong. please try again .")
//                 }
//             }
//         } else {
//             seterror("Enter code")
//         }
//     };

//     const back = () => {
//         navigate("/resetpassword", { replace: true })
//     };

//     return (
//         <>
//             <ToastContainer />
//             {changecontent ?
//                 <div className="flex  min-h-screen bg-gray-100">
//                     <div className="bg-white p-6 rounded-lg shadow-md w-96 m-auto">
//                         <h2 className="text-2xl font-bold text-gray-700 text-center">Reset Password</h2>
//                         {Error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                         <form onSubmit={handleSubmit} className="mt-4">
//                             <div className="mb-3">
//                                 <label className="block text-gray-600 text-sm">New Password</label>
//                                 <input
//                                     type="password"
//                                     className="w-full mt-1 p-2 border border-b-2 rounded-md outline-none"
//                                     value={newPassword}
//                                     onChange={(e) => setNewPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-3">
//                                 <label className="block text-gray-600 text-sm">Confirm Password</label>
//                                 <input
//                                     type="password"
//                                     className="w-full mt-1 p-2 border border-b-2 rounded-md outline-none"
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full bg-blue-600 text-white py-2 rounded-md mt-2 hover:bg-blue-700 "
//                             >
//                                 Reset Password
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//                 :
//                 <div className="w-full h-screen flex justify-center items-center bg-gray-100">
//                     <div className='w-72  h-fit flex-col  my-auto sm:w-96 flex p-4  bg-white rounded-lg shadow-md'>
//                         <h2 className='mt-3 text-center font-bold text-2xl'>Creative Thread</h2>
//                         <h4 className='mt-3 text-center font-medium text-md'>Verify Your email address to reset password</h4>
//                         <p className='mt-3 mb-4 text-center font-normal'>Enter the verification code we sent to. if you don't see it, check your spam folder</p>
//                         <div className='relative mb-1'>
//                             <span className='fixed -mt-3 ml-1.5 bg-white w-20 text-center text-black'>Enter code</span>
//                             <input type="text" value={code} onChange={handlechange} className=' w-full h-10 pl-2 border-2 border-b-2 outline-none bg-white  rounded-md' />
//                         </div>
//                         {error && <p className=' text-red-600 text-xs'>{error}</p>}
//                         <div className='flex justify-between h-8 mt-6'>
//                             <button onClick={back} className='text-black font-medium   cursor-pointer'>Back</button>
//                             <button onClick={checkcode} className=' bg-black font-medium text-white text-center cursor-pointer w-20  rounded-md'>Next</button>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </>
//     );
// };

// export default ChangePassword;
