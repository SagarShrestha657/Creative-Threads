import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Logout = () => {

  const handleLogout = async () => {
    try {
      NProgress.start();
      await axiosInstance.post("/auth/logout");
      sessionStorage.clear();
      NProgress.done();
      window.location.href = "/login";
      toast.success("Logout successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
    NProgress.done()
  };

  return (
    <button
      onClick={handleLogout}
      className=" p-6  flex items-center gap-2 text-red-600 hover:text-red-800 font-medium cursor-pointer"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
};

export default Logout;
