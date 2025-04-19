import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

// Lucide Icons
import { Cake, Phone, Globe, Home, VenetianMask, Pencil } from "lucide-react";

export default function PersonalInfo() {
  const { authUser, userUpdate } = useAuthStore();
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Set initial values from authUser
  useEffect(() => {
    if (authUser) {
      setDob(authUser?.dob?.slice(0, 10) || "");
      setPhone(authUser?.phone || "");
      setCountry(authUser?.country || "");
      setCity(authUser?.city || "");
      setGender(authUser?.gender || "");
    }
  }, [authUser]);

  const handleSave = async () => {
    NProgress.start();
    setLoading(true);

    if (!dob || !phone || !country || !city || !gender) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      NProgress.done();
      return;
    }

    try {
      const res = await axiosInstance.patch("/update/personalinfo", {
        dob,
        phone,
        country,
        city,
        gender,
      });

      // Update local store
      userUpdate("dob", dob);
      userUpdate("phone", phone);
      userUpdate("country", country);
      userUpdate("city", city);
      userUpdate("gender", gender);

      toast.success(res.data.message);
      setEditMode(false);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Failed");
    }

    setLoading(false);
    NProgress.done();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Personal Information
        </h2>
        <button
          className="flex items-center text-sm text-blue-600 hover:underline"
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil className="mr-1 w-4 h-4" />
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* DOB */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Cake className="w-4 h-4 mr-2" /> Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!editMode}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Phone className="w-4 h-4 mr-2" /> Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and limit to 10 characters
              const numericValue = value.replace(/\D/g, "").slice(0, 10);
              setPhone(numericValue);
            }}
            disabled={!editMode}
            maxLength={10}
            placeholder="Enter 10-digit number"
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Country */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Globe className="w-4 h-4 mr-2" /> Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={!editMode}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* City */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Home className="w-4 h-4 mr-2" /> City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!editMode}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Gender */}
        <div className="sm:col-span-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <VenetianMask className="w-4 h-4 mr-2" /> Gender
          </label>
          <div className="flex items-center space-x-6">
            {["male", "female", "other"].map((option) => (
              <label
                key={option}
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={() => setGender(option)}
                  disabled={!editMode}
                  className="h-4 w-4 text-black focus:ring-black"
                />
                <span className="text-sm capitalize text-gray-700">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {editMode && (
        <button
          onClick={handleSave}
          disabled={loading}
          className={`rounded-md bg-black px-4 py-2 mt-4 text-sm font-medium text-white transition hover:opacity-90 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      )}
    </div>
  );
}
