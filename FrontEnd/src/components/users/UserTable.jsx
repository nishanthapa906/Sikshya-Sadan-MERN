import { FaUserEdit, FaTrash } from "react-icons/fa";

const UserTable = ({
users,
loading,
onDelete,
onToggleStatus,
onEdit
}) => {

if(loading) return <p>Loading users...</p>;

return (

<table className="w-full border">

<thead className="bg-gray-100">
<tr>
<th className="p-3 text-left">Name</th>
<th>Email</th>
<th>Role</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{users.map(user => (

<tr key={user._id} className="border-t">

<td className="p-3">{user.name}</td>

<td>{user.email}</td>

<td>{user.role}</td>

<td>

<button
onClick={()=>onToggleStatus(user._id,user.isActive)}
className={user.isActive ? "text-green-600" : "text-red-600"}
>
{user.isActive ? "Active" : "Inactive"}
</button>

</td>

<td className="flex gap-3 p-3">

<button onClick={()=>onEdit(user)}>
<FaUserEdit/>
</button>

<button onClick={()=>onDelete(user._id)}>
<FaTrash/>
</button>

</td>

</tr>

))}

</tbody>

</table>

);

};

export default UserTable;