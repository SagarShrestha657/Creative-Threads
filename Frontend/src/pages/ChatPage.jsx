import React from 'react'
import { Bell } from 'lucide-react'
import Navbar from '../components/NavbarComponent'
// import ChatComponent from '../components/ChatComponent'
import ChatHomeComponent from '../components/ChatComponents/ChatHomeComponent'

const Chat = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col lg:flex-row relative">

      {/* 📰 Chat */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
        <ChatHomeComponent />
      </div>
    </div>
  )
}

export default Chat
