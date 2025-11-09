import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./BookingForm.css";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    address: "",
    contact: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (user) setForm((prev) => ({ ...prev, customerName: user.username }));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ simple frontend validations
  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Full name is required";
    if (!form.date) errs.date = "Booking date is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!/^[0-9]{10}$/.test(form.contact)) errs.contact = "Enter valid 10-digit contact number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!user) {
      alert("Please login as customer");
      return;
    }

    setLoading(true);
    try {
      const resp = await api.post("/bookings", {
        serviceId: id,
        customerId: user._id,
        customerName: form.customerName,
        date: form.date,
        address: form.address,
        contact: form.contact,
        notes: form.notes,
      });
      navigate(`/payment/${resp.data._id}`);
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!service)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  return (
    <div className="booking-page">
      <div className="booking-card shadow-lg p-4">
        <h2 className="text-center text-primary mb-4 fw-bold">
          Book Your Service
        </h2>

        {/* Service Info */}
        <div className="booking-summary text-center mb-4">
          <img
            src={service.image || "/images/Home.png"}
            alt={service.name}
            className="booking-image"
          />
          <h4 className="mt-3 fw-semibold">{service.name}</h4>
          <p className="text-muted small mb-1">{service.category}</p>
          <p className="text-muted small">{service.description}</p>
          <p className="fw-bold text-success fs-5">
            ₹{service.price?.toLocaleString()}
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              name="customerName"
              className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.customerName && (
              <div className="invalid-feedback">{errors.customerName}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              name="date"
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <textarea
              name="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              value={form.address}
              onChange={handleChange}
              placeholder="Your complete address"
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contact Number</label>
            <input
              name="contact"
              className={`form-control ${errors.contact ? "is-invalid" : ""}`}
              value={form.contact}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />
            {errors.contact && (
              <div className="invalid-feedback">{errors.contact}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Notes (optional)</label>
            <input
              name="notes"
              className="form-control"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special requests?"
            />
          </div>

          <button
            className="btn btn-gradient w-100 py-2 fw-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
