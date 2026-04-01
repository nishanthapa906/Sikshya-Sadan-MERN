import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pw: "", cpw: "", avatar: null });
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.pw !== form.cpw) return alert("Passwords mismatch");
    setLoad(true);
    let res;
    if (form.avatar) {
      const fd = new FormData();
      fd.append("name", form.name); fd.append("email", form.email); fd.append("phone", form.phone);
      fd.append("password", form.pw); fd.append("role", "student"); fd.append("avatar", form.avatar);
      res = await register(fd);
    } else {
      res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.pw, role: "student" });
    }
    if (res.success) nav("/student/dashboard");
    else { alert(res.message || "Failed to register"); setLoad(false); }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 font-sans py-12 bg-slate-50">
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-center text-slate-800 mb-8">Create Account</h1>
        <form onSubmit={submit} className="space-y-5">
          {['name', 'email', 'phone'].map(f => (
            <div key={f}>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{f}</label>
              <input type={f==='email'?'email':'text'} required value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
              <input type="password" required value={form.pw} onChange={e => setForm({...form, pw: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Confirm</label>
              <input type="password" required value={form.cpw} onChange={e => setForm({...form, cpw: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Profile Photo (Optional)</label>
            <input type="file" onChange={e => setForm({...form, avatar: e.target.files[0]})} className="w-full p-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 mt-6">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-8 text-sm font-medium text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;