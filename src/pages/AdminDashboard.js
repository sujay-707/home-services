import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
    api.get("/bookings").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/auth/users").then((r) => setUsers(r.data)).catch(() => {}); // ✅ fetch all users
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Total Services</h6>
            <h3 className="text-primary">{services.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Total Bookings</h6>
            <h3 className="text-success">{bookings.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Registered Users</h6>
            <h3 className="text-info">{users.length}</h3>
          </div>
        </div>
      </div>

      <h4 className="mb-3">👥 All Users</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role === "customer" ? (
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`/admin/user/${u.username}`}
                    >
                      View Bookings
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
