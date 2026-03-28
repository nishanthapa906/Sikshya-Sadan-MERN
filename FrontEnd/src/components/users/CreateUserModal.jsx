import { useState } from "react";
import { adminAPI } from "../../services/api";

const CreateUserModal = ({show,onClose,refresh}) => {

const [data,setData] = useState({
name:"",
email:"",
password:"",
role:"student"
});

if(!show) return null;

const handleSubmit = async(e)=>{
e.preventDefault();

await adminAPI.createUser(data);

refresh();
onClose();
};

return (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<form
onSubmit={handleSubmit}
className="bg-white p-6 rounded space-y-3"
>

<h2 className="text-lg font-bold">Create User</h2>

<input
placeholder="Name"
value={data.name}
onChange={e=>setData({...data,name:e.target.value})}
className="border p-2 w-full"
/>

<input
placeholder="Email"
value={data.email}
onChange={e=>setData({...data,email:e.target.value})}
className="border p-2 w-full"
/>

<input
placeholder="Password"
type="password"
value={data.password}
onChange={e=>setData({...data,password:e.target.value})}
className="border p-2 w-full"
/>

<button className="bg-indigo-600 text-white px-4 py-2 rounded">
Create
</button>

</form>

</div>

);

};

export default CreateUserModal;