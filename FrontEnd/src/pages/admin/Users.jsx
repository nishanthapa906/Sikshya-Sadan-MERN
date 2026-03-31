import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import EditUserModal from "../../components/users_con_byadmin/EditUserModal";
import UserFilters from "../../components/users_con_byadmin/UserFilter";
import UserTable from "../../components/users_con_byadmin/UserTable";
import CreateUserModal from "../../components/users_con_byadmin/CreateUserModal";




//API calls
// state
// filtering
// passing data to components
const Users = () => {

const [users,setUsers] = useState([]);
const [loading,setLoading] = useState(true);

const [searchTerm,setSearchTerm] = useState("");
const [roleFilter,setRoleFilter] = useState("");
const [statusFilter,setStatusFilter] = useState("");

const [showCreate,setShowCreate] = useState(false);
const [showEdit,setShowEdit] = useState(false);
const [editingUser,setEditingUser] = useState(null);

useEffect(()=>{
fetchUsers();
},[]);

const fetchUsers = async () => {
try{
const res = await adminAPI.getAllUsers();
setUsers(res.data.data || []);
}catch{
alert("Failed to load users");
}
setLoading(false);
};

const handleDelete = async(id)=>{
if(!window.confirm("Delete user?")) return;

await adminAPI.deleteUser(id);
setUsers(users.filter(u=>u._id !== id));
};

const handleToggleStatus = async(id,status)=>{

const newStatus = !status;

await adminAPI.updateUserStatus(id,newStatus);

setUsers(users.map(u =>
u._id === id ? {...u,isActive:newStatus} : u
));

};

const filteredUsers = users.filter(u=>{

const search =
u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
u.email.toLowerCase().includes(searchTerm.toLowerCase());

const role = !roleFilter || u.role === roleFilter;

const status =
!statusFilter ||
(statusFilter === "active" ? u.isActive : !u.isActive);

return search && role && status;

});

return (

<div className="min-h-screen bg-slate-50 pt-28 pb-12">
<div className="max-w-7xl mx-auto px-6">

<div className="mb-8">
    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">User Management</h1>
    <p className="text-slate-500 text-lg">Add new users, edit roles, and manage system access.</p>
</div>

<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

<UserFilters
searchTerm={searchTerm}
setSearchTerm={setSearchTerm}
roleFilter={roleFilter}
setRoleFilter={setRoleFilter}
statusFilter={statusFilter}
setStatusFilter={setStatusFilter}
onCreate={()=>setShowCreate(true)}
/>

<UserTable
users={filteredUsers}
loading={loading}
onDelete={handleDelete}
onToggleStatus={handleToggleStatus}
onEdit={(u)=>{
setEditingUser(u);
setShowEdit(true);
}}
/>

<CreateUserModal
show={showCreate}
onClose={()=>setShowCreate(false)}
refresh={fetchUsers}
/>

<EditUserModal
show={showEdit}
user={editingUser}
onClose={()=>setShowEdit(false)}
refresh={fetchUsers}
/>

</div>
</div>
</div>

);

};

export default Users;