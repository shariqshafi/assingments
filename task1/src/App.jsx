import { useEffect, useState } from "react";
export default function App() {
  const [users, setUsers] = useState([]);

useEffect(() => {
  fetch("https://gorest.co.in/public/v2/users")
    .then((res) => res.json())
    .then((data) => setUsers(data))
    .catch((err) => console.error("Error fetching users:", err));
}, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Users</h1>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Status</th>
          </tr>
        </thead>
       <tbody>
  {users.map((u) => (
    <tr key={u.id}>
      <td>{u.id}</td>
      <td>{u.name}</td>
      <td>{u.email}</td>
      <td>{u.gender}</td>
      <td>{u.status}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
