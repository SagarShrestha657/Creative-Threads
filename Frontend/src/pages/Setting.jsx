import React from 'react'
import Navbar from '../components/NavbarComponent'
import ChangeEmail from '../components/ChangeEmail'
import ChangePassword from '../components/ChangePassword'
import PersonalInfo from '../components/PersonalInfo'
import Logout from '../components/Logout'

const Setting = () => {
    return (
        <div className="bg-black min-h-screen flex flex-col md:flex-row">
            <Navbar />
            <div className="w-[80%] mx-auto px-4 py-6 ">
                <div className="bg-white rounded-lg border border-neutral-200/20 mb-6 flex-row space-y-3">
                    <ChangeEmail />
                    <ChangePassword />
                    <PersonalInfo />
                    <Logout/>
                </div>

            </div>


        </div>
    )
}

export default Setting