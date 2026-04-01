import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const EditUserModal = ({ show, user, onClose, refresh }) => {
    const [data, setData] = useState({ name: "", email: "", role: "" });

    useEffect(() => { if (user) setData({ name: user.name, email: user.email, role: user.role }); }, [user]);

    if (!show || !user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await adminAPI.updateUser(user._id, data);
        refresh(); onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', minWidth: '320px' }}>
                <h2 style={{ marginTop: 0 }}>Edit User</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr><td style={{ padding: '0.4rem 0' }}><label>Name</label></td></tr>
                        <tr><td><input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></td></tr>
                        <tr><td style={{ padding: '0.4rem 0' }}><label>Email</label></td></tr>
                        <tr><td><input value={data.email} onChange={e => setData({ ...data, email: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></td></tr>
                        <tr><td style={{ padding: '0.4rem 0' }}><label>Role</label></td></tr>
                        <tr>
                            <td>
                                <select value={data.role} onChange={e => setData({ ...data, role: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ padding: '0.4rem 1rem', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.4rem 1rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserModal;