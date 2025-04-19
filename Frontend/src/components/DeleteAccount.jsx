import { useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function DeleteAccount() {
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const handleDelete = () => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setDeleted(true);
        }, 1500);
    };

    if (deleted) {
        return (
            <div className="rounded-md border border-red-300 bg-red-100 p-4 text-sm text-red-700">
                Your account has been deleted.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete Account</h2>

            <div className="rounded-md border border-red-300 bg-red-100 p-4 text-sm text-red-600 flex flex-col">
                <p>Once you delete your account, there is no going back. Please be certain.</p>


                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`rounded-md border border-red-500 px-4 w-fit mt-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
}
