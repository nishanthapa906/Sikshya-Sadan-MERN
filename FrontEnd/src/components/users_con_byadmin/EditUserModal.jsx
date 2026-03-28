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

<h2 className="text-lg font-bold">Edit User</h2>

<input
value={data.name}
onChange={e=>setData({...data,name:e.target.value})}
className="border p-2 w-full"
/>

<input
value={data.email}
onChange={e=>setData({...data,email:e.target.value})}
className="border p-2 w-full"
/>

<button className="bg-indigo-600 text-white px-4 py-2 rounded">
Update
</button>

</form>

</div>

);

};

export default EditUserModal;