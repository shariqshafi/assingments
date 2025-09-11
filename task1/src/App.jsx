import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);

    // build query params dynamically
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("per_page", itemsPerPage);

    if (search.trim()) params.append("name", search.trim());
    if (gender !== "all") params.append("gender", gender);
    if (status !== "all") params.append("status", status);

    const url = `https://gorest.co.in/public/v2/users?${params.toString()}`;

    fetch(url, {
      headers: {
        "x-api-key": "reqres-free-v1", // ✅ required header
      },
    })
      .then((res) => {
        const total = res.headers.get("X-Pagination-Total");
        if (total) {
          setTotalPages(Math.ceil(total / itemsPerPage));
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError(err);
        setLoading(false);
      });
  }, [currentPage, itemsPerPage, search, gender, status]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Users</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Failed to load users</p>}

      {/* search + filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          style={{ padding: 8, width: 220 }}
        />

        <select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: 8 }}
        >
          <option value="all">All genders</option>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: 8 }}
        >
          <option value="all">All status</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setGender("all");
            setStatus("all");
            setCurrentPage(1);
          }}
          style={{ padding: "8px 12px" }}
        >
          Reset
        </button>
      </div>

      {/* table */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f6f6f6" }}>
            {["ID", "Name", "Email", "Gender", "Status"].map((h) => (
              <th
                key={h}
                style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{u.id}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{u.name}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{u.email}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{u.gender}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{u.status}</td>
            </tr>
          ))}
          {!loading && !error && users.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 12, textAlign: "center", color: "#666" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination controls */}
      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>

        {/* dynamic per_page selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // reset to page 1 when size changes
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>
    </div>
  );
}
