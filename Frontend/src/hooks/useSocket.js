import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a custom hook to manage socket.io connection
const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Ensure you only create a socket connection if userId exists
    if (userId) {
      const newSocket = io("http://localhost:5000");  // Replace with your server's URL

      // Join a room specific to the user
      newSocket.emit("join", userId);

      // Set the socket connection to the state
      setSocket(newSocket);

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId]); // Only reconnect if userId changes

  return socket;
};

export default useSocket;
