import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    const load = async () => {
        try {
            const res = await adminAPI.getAllUsers();
            setUsers(res.data.data || []);
        } catch { alert("Failed to load users"); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const toggle = async (id, status) => {
        try {
            await adminAPI.updateUserStatus(id, !status);
            setUsers(users.map(u => u._id === id ? { ...u, isActive: !status } : u));
        } catch { alert("Failed to update"); }
    };

    const del = async (id) => {
        if (!confirm("Delete user?")) return;
        try {
            await adminAPI.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch { alert("Failed to delete"); }
    };

    const filtered = users.filter(u => 
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
        (!role || u.role === role)
    );

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6">
            <h1 className="text-3xl font-black text-slate-800 mb-8">User Management</h1>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full sm:w-48 p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All Roles</option><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                            <th className="p-4 font-black">Name</th>
                            <th className="p-4 font-black">Contact Info</th>
                            <th className="p-4 font-black">Role</th>
                            <th className="p-4 font-black">Status</th>
                            <th className="p-4 font-black text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                                <td className="p-4 font-bold text-slate-800">{u.name}</td>
                                <td className="p-4 text-sm text-slate-700">{u.email} <br/><span className="text-xs text-slate-400 font-medium">{u.phone || 'N/A'}</span></td>
                                <td className="p-4 text-sm font-bold text-indigo-600 capitalize">{u.role}</td>
                                <td className="p-4 text-xs font-black uppercase tracking-widest"><span className={`px-2 py-1 rounded-md ${u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{u.isActive ? 'Active' : 'Blocked'}</span></td>
                                <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                    <button onClick={() => toggle(u._id, u.isActive)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${u.isActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}>{u.isActive ? 'Block' : 'Unblock'}</button>
                                    <button onClick={() => del(u._id)} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 transition-colors">Del</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400 font-bold">No users match criteria.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;