import { useState,useEffect } from "react";
import { adminAPI } from "../../services/api";

const EditUserModal = ({show,user,onClose,refresh}) => {

const [data,setData] = useState({
name:"",
email:"",
role:""
});

useEffect(()=>{
if(user){
setData({
name:user.name,
email:user.email,
role:user.role
});
}
},[user]);

if(!show || !user) return null;

const handleSubmit = async(e)=>{
e.preventDefault();

await adminAPI.updateUser(user._id,data);

refresh();
onClose();
};

return (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<form
onSubmit={handleSubmit}
className="bg-white p-6 rounded space-y-3"
>

<h2 className="text-xl font-bold text-slate-900 mb-2">Edit User</h2>

<div className="space-y-4">
    <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Name</label>
        <input
        value={data.name}
        onChange={e=>setData({...data,name:e.target.value})}
        className="border border-slate-300 rounded p-2 w-full"
        />
    </div>

    <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Email</label>
        <input
        value={data.email}
        onChange={e=>setData({...data,email:e.target.value})}
        className="border border-slate-300 rounded p-2 w-full"
        />
    </div>

    <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1">Role</label>
        <select
        value={data.role}
        onChange={e=>setData({...data,role:e.target.value})}
        className="border border-slate-300 rounded p-2 w-full bg-white"
        >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
        </select>
    </div>
</div>

<div className="flex gap-3 justify-end mt-6">
    <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50">Cancel</button>
    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold">
    Update User
    </button>
</div>

</form>

</div>

);

};

export default EditUserModal;