import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function UserBookings() {
  const { username } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/user/${username}`)
      .then((res) => setBookings(res.data))
      .catch(() => alert("Failed to fetch user bookings"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📋 {username}'s Bookings</h3>

      {bookings.length === 0 ? (
        <div className="alert alert-info">No bookings found for this user.</div>
      ) : (
        <div className="row">
          {bookings.map((b) => (
            <div className="col-md-4 mb-3" key={b._id}>
              <div className="card shadow-sm p-3">
                <h5 className="text-primary">{b.serviceId?.name}</h5>
                <p className="mb-1"><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Address:</strong> {b.address}</p>
                <p className="mb-1"><strong>Contact:</strong> {b.contact}</p>
                <p className="mb-1"><strong>Status:</strong> {b.paid ? "Paid" : "Pending"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/admin" className="btn btn-outline-primary mt-3">← Back to Dashboard</Link>
    </div>
  );
}
