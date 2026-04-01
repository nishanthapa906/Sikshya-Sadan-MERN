import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI, UPLOAD_URL } from "../services/api";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef(null);
  
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoad] = useState(false);

  const changePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData(); fd.append("avatar", file);
      const res = await authAPI.updateProfile(fd);
      if (res.data?.user) updateUser(res.data.user);
      alert("Photo updated!");
    } catch { alert("Failed to upload photo"); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const res = await authAPI.updateProfile(form);
      if (res.data?.user) updateUser(res.data.user);
      alert("Profile updated!");
    } catch { alert("Failed to update profile"); }
    finally { setLoad(false); }
  };

  const handleLogout = () => { logout(); nav("/login"); };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-black text-center text-slate-800 mb-8">My Profile</h1>
      
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100">
        <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-sm overflow-hidden flex justify-center items-center text-3xl font-black text-indigo-400">
          {user?.avatar ? <img src={`${UPLOAD_URL}/${user.avatar}`} alt="avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <button onClick={() => fileRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-6 py-2 rounded-lg cursor-pointer font-bold transition-colors mb-2">Change Photo</button>
          <input type="file" ref={fileRef} accept="image/*" onChange={changePhoto} className="hidden" />
          <div className="text-xs text-slate-400 tracking-widest uppercase font-bold">Role: <span className="text-indigo-500">{user?.role}</span></div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block font-black text-xs uppercase tracking-widest text-slate-500 mb-2">Email (Read Only)</label>
          <input type="email" value={user?.email || ""} readOnly className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 font-medium cursor-not-allowed" />
        </div>
        <div>
          <label className="block font-black text-xs uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
        </div>
        <div>
          <label className="block font-black text-xs uppercase tracking-widest text-slate-500 mb-2">Phone</label>
          <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-8 border-t border-slate-100">
          <button type="submit" disabled={loading} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border-0 p-4 rounded-xl font-bold cursor-pointer transition-colors">{loading ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={handleLogout} className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-0 p-4 rounded-xl font-bold cursor-pointer transition-colors">Sign Out</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;