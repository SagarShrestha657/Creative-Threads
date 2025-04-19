import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ChangePaswword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("❌ Passwords do not match.");
            return;
        }
        if (oldPassword === newPassword) {
            toast.error("❌ Cannot keep same password.");
            return;
        }
        
        NProgress.start()
        setLoading(true);
        try {
            const res = await axiosInstance.patch("/auth/changepassword", { oldPassword, newPassword })
            console.log(res);            
            toast.success(res.data.message)
        } catch (error) {
            console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message || " failed")
        }
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setLoading(false)
        NProgress.done()

    };

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Password</h2>

            <input
                type="password"
                placeholder="Current Password"
                className="w-full rounded-md  px-3 mb-3 py-2 text-sm border border-gray-300 bg-white  focus:border-black focus:outline-none"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                className="w-full rounded-md px-3 py-2 mb-3 text-sm border border-gray-300 bg-white  focus:border-black focus:outline-none "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full rounded-md  px-3 py-2 mb-3 text-sm border border-gray-300 bg-white  focus:border-black focus:outline-none "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
                onClick={handleUpdate}
                disabled={loading}
                className={`w-fit rounded-md px-4 py-2 text-sm font-medium text-white ${loading ? "bg-gray-400" : "bg-black hover:bg-black/90"
                    }`}
            >
                {loading ? "Updating..." : "Update Password"}
            </button>

            {/* {message && (
                <p
                    className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )} */}
        </div>
    );
}
