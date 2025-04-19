// import { useState } from "react";
// import { axiosInstance } from "../lib/axios";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import { ToastContainer, toast } from 'react-toastify';

// const PasswordReset = () => {
//     const [oldPassword, setOldPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
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
//             const password = { oldpassword: oldPassword, newpassword: newPassword }
//             const res = await axiosInstance.post("/auth/resetpassword", password)
//             toast.success(res.data.message)
//             setOldPassword("")
//             setNewPassword("")
//             setConfirmPassword("")
//         } catch (err) {
//             if (err.response.data.message)
//                 setError(err.response.data.message);
//         }
//     };

//     const sendotp = async () => {
//         try {
//             const email = User.email
//             await axiosInstance.post("/auth/sendotp", { email })
//             navigate("/changepassword", { replace: true })

//         } catch (error) {
//             console.log(error)
//             setError(error.response.data.message)
//         }
//     };

//     return (
//         <>
//             <ToastContainer />
//             <div className="flex  min-h-screen bg-gray-100">
//                 <div className="bg-white p-6 rounded-lg shadow-md w-96 m-auto">
//                     <h2 className="text-2xl font-bold text-gray-700 text-center">Reset Password</h2>
//                     <div className="flex justify-center">
//                         <h2 className="text-md  text-gray-700 pr-1">Click on email to reset Password using </h2>
//                         <h2 className="text-blue-600 cursor-pointer" onClick={sendotp} >Email</h2>
//                     </div>
//                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                     <form onSubmit={handleSubmit} className="mt-4">
//                         <div className="mb-3">
//                             <label className="block text-gray-600 text-sm">Old Password</label>
//                             <input
//                                 type="password"
//                                 className="w-full mt-1 p-2 border border-b-2 rounded-md outline-none"
//                                 value={oldPassword}
//                                 onChange={(e) => setOldPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label className="block text-gray-600 text-sm">New Password</label>
//                             <input
//                                 type="password"
//                                 className="w-full mt-1 p-2 border border-b-2 rounded-md outline-none"
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label className="block text-gray-600 text-sm">Confirm Password</label>
//                             <input
//                                 type="password"
//                                 className="w-full mt-1 p-2 border border-b-2 rounded-md outline-none"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-600 text-white py-2 rounded-md mt-2 hover:bg-blue-700 "
//                         >
//                             Reset Password
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PasswordReset;
