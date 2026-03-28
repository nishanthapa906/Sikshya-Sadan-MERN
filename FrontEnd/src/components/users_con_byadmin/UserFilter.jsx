import { FaSearch, FaUserPlus } from "react-icons/fa";

//
// search
// role filter
// status filter
// create button
const UserFilters = ({
searchTerm,
setSearchTerm,
roleFilter,
setRoleFilter,
statusFilter,
setStatusFilter,
onCreate
}) => {

return (

<div className="flex flex-wrap gap-3 mb-6">

<div className="flex items-center border rounded px-3 py-2">
<FaSearch className="mr-2"/>
<input
placeholder="Search users..."
value={searchTerm}
onChange={e=>setSearchTerm(e.target.value)}
className="outline-none"
/>
</div>

<select
value={roleFilter}
onChange={e=>setRoleFilter(e.target.value)}
className="border rounded px-3 py-2"
>
<option value="">All Roles</option>
<option value="student">Student</option>
<option value="teacher">Teacher</option>
<option value="admin">Admin</option>
</select>

<select
value={statusFilter}
onChange={e=>setStatusFilter(e.target.value)}
className="border rounded px-3 py-2"
>
<option value="">All Status</option>
<option value="active">Active</option>
<option value="inactive">Inactive</option>
</select>

<button
onClick={onCreate}
className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
>
<FaUserPlus/>
Create User
</button>

</div>

);

};

export default UserFilters;