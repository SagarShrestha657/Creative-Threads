import React from 'react'
import Notification from '../components/Notification'
import { Bell } from 'lucide-react'
import Navbar from '../components/NavbarComponent'

const NotificationPage = () => {
  return (
    <>
     <div className="bg-black min-h-screen flex flex-col lg:flex-row relative">
      {/* 🔝 Top bar for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-200/20 flex items-center justify-between px-4 h-14">
        <h1 className="text-white font-bold text-lg">Creative Threads</h1>
        <button>
          <Bell className="text-white w-6 h-6" />
        </button>
      </div>

      {/* 🧭 Sidebar for desktop */}
      <div className="hidden lg:block ">
        <Navbar />
      </div>

      {/* 📱 Bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-200/20 flex justify-around items-center h-16 px-4">
        <Navbar />
      </div>

      {/* 📰 Notification */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-16 pb-20 lg:pt-10 lg:pb-10 lg:px-8">
        <Notification />
      </div>
    </div> 
    </>
  )
}

export default NotificationPage
