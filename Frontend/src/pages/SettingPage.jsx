import React from "react";
import Navbar from "../components/NavbarComponent";
import ChangeEmail from "../components/ChangeEmail";
import ChangePassword from "../components/ChangePassword";
import PersonalInfo from "../components/PersonalInfo";
import Logout from "../components/LogoutComponent";

const Setting = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 px-4 py-6">
                <div className="bg-white rounded-lg border border-neutral-200/20 p-4 sm:p-6 space-y-6 min-h-screen">
                    <ChangeEmail />
                    <ChangePassword />
                    <PersonalInfo />
                    <Logout />
                </div>
            </div>
    </div>
  );
};

export default Setting;
