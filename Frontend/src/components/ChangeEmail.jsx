import { useState } from "react";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { validate } from "email-validator";

export default function ChangeEmail() {
    const { authUser, userUpdate } = useAuthStore();
    const [step, setStep] = useState("view");
    const [newEmail, setNewEmail] = useState(authUser.email);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!newEmail || newEmail === authUser.email) {
            return toast.error("Please enter a different valid email.");
        }
        if (!validate(newEmail)) {
            return toast.error("invalid email.");
        }

        try {
            NProgress.start();
            setLoading(true);
            localStorage.setItem("newEmail", newEmail);
            const res = await axiosInstance.post("/auth/sendotp", { newEmail });
            toast.success(res.data.message || "OTP sent to your new email.");
            setStep("verify");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
            NProgress.done();
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Please enter the OTP.");

        try {
            NProgress.start();
            setLoading(true);
            const res = await axiosInstance.patch("/auth/verifyotp", {
                email: newEmail,
                otp,
            });

            toast.success(res.data.message || "Email updated.");
            userUpdate("email", newEmail);
            setStep("view");
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message || "OTP verification failed.");
        } finally {
            setOtp("")
            setLoading(false);
            NProgress.done();
        }
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Address</h2>

            {step === "view" && (
                <div className="bg-gray-100 px-4 py-3 rounded-md flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Current Email</p>
                        <p className="text-sm font-medium text-gray-800">{authUser.email}</p>
                    </div>
                    <button
                        onClick={() => setStep("edit")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Change
                    </button>
                </div>
            )}

            {step === "edit" && (
                <div className="space-y-3">
                    <input
                        type="email"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:border-black focus:outline-none"
                        placeholder="Enter new email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className={`bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-80 ${loading && "opacity-50 cursor-not-allowed"}`}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                        <button
                            onClick={() => setStep("view")}
                            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === "verify" && (
                <div className="space-y-3">
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:border-black focus:outline-none"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className={`bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-80 ${loading && "opacity-50 cursor-not-allowed"}`}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            onClick={() => setStep("edit")}
                            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
