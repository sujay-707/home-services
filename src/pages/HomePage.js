// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import ServiceCard from "../components/ServiceCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        toast.error("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading available services...</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-4 text-center">
        Available Home Services
      </h2>
      <div className="row g-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div className="col-md-4" key={service._id}>
              <ServiceCard service={service} isCustomer={user?.role === "customer"} />
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No services available at the moment.</p>
        )}
      </div>
    </div>
  );
}
