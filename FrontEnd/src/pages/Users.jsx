import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import UserTable from "../components/users/UserTable";
import UserFilters from "../components/users/UserFilters";
import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";



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

<div className="p-6">

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

);

};

export default Users;