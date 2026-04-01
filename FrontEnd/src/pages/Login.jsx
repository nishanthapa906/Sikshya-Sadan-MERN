import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, set] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const res = await login(email, pw);
    if (res.success) {
      if (res.user.role === "admin") nav("/admin/dashboard");
      else if (res.user.role === "instructor") nav("/instructor/dashboard");
      else nav("/student/dashboard");
    } else {
      alert(res.message || "Failed to login");
      setLoad(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4 font-sans bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-center text-slate-800 mb-8">Welcome Back</h1>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input type="email" required value={email} onChange={e => set(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
            </div>
            <input type="password" required value={pw} onChange={e => setPw(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 mt-4">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-8 text-sm font-medium text-slate-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;