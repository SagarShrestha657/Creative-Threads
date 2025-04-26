import React from 'react';
import { axiosInstance } from '../lib/axios';
import io from "socket.io-client"
import { useNavigate } from 'react-router-dom';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import socket from "../lib/socket"

const LogoutComponent = () => {
  // const SOCKET_URL = "http://localhost:5001";
  //   const socket = io.connect(SOCKET_URL,{
  //     // transport:["websocket"]
  //   })

  const handleLogout = async () => {
    try {
      NProgress.start();
      await axiosInstance.post('/auth/logout');
      socket.disconnect()
      sessionStorage.clear();
      NProgress.done()
      useNavigate("/login")
    } catch (error) {
      console.error('Logout failed', error);
    }
    NProgress.done()
  };

  return (
    <div className="flex justify-end p-4">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutComponent;
