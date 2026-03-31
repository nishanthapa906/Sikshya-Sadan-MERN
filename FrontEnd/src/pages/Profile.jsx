import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { authAPI, UPLOAD_URL } from "../services/api";
import { FaCamera, FaSave, FaSignOutAlt, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Photo change - upload immediately when file selected
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview right away
    setPreview(URL.createObjectURL(file));
    setIsPhotoLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authAPI.updateProfile(formData);
      if (res.data?.user) updateUser(res.data.user);
      toast.success("Profile photo updated!");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsPhotoLoading(false);
    }
  };

  // Save name and phone
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authAPI.updateProfile({ name, phone });
      if (res.data?.user) updateUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Show preview or existing photo or first letter
  const avatarSrc = preview || (user?.avatar ? `${UPLOAD_URL}/${user.avatar}` : null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="w-[90%] max-w-3xl m-auto">

        {/* ===== PAGE TITLE ===== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information</p>
        </div>

        {/* ===== MAIN CARD ===== */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Colorful top banner */}
          <div className="h-28 bg-blue-600"></div>

          <div className="px-8 pb-8">

            {/* ===== AVATAR + ROLE ===== */}
            <div className="flex items-end justify-between -mt-12 mb-8">

              {/* Avatar with upload button */}
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-blue-100">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Camera button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPhotoLoading}
                  className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg"
                  title="Change photo"
                >
                  {isPhotoLoading ? (
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <FaCamera size={12} />
                  )}
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Role badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                user?.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : user?.role === "instructor"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {user?.role}
              </span>
            </div>

            {/* ===== FORM ===== */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name + Phone side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Name */}
                <div className="flex flex-col gap-y-2 text-lg">
                  <label className="font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-300 p-3 pl-10 rounded-lg outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-y-2 text-lg">
                  <label className="font-semibold text-gray-700">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border border-gray-300 p-3 pl-10 rounded-lg outline-none focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Email - read only */}
              <div className="flex flex-col gap-y-2 text-lg">
                <label className="font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="border border-gray-200 bg-gray-50 text-gray-400 p-3 pl-10 rounded-lg outline-none cursor-not-allowed w-full"
                  />
                </div>
                <p className="text-sm text-gray-400">Email cannot be changed</p>
              </div>

              {/* Save + Logout buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg text-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={16} /> Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-700 font-semibold rounded-lg text-lg flex items-center gap-2"
                >
                  <FaSignOutAlt size={16} /> Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== ACCOUNT INFO CARD ===== */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
            Account Info
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 font-medium">Member Since</p>
              <p className="font-bold text-gray-800 mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Account Status</p>
              <p className="font-bold text-green-600 mt-1 flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;