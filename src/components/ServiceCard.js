import React from "react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service, isCustomer }) {
  return (
    <div
      className="card shadow-lg border-0 h-100 rounded-4"
      style={{
        transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* IMAGE */}
      <div className="position-relative">
        <img
          src={service.image}
          alt={service.name}
          className="card-img-top"
          style={{
            height: "200px",
            width: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "0.8rem",
            borderTopRightRadius: "0.8rem",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/Home.png"; // fallback local image
          }}
        />

        {/* Category Badge */}
        <span
          className="badge bg-primary position-absolute top-0 start-0 m-2 px-3 py-2"
          style={{
            fontSize: "0.8rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(0, 123, 255, 0.85)",
          }}
        >
          {service.category}
        </span>
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-dark mb-1">
          {service.name}
        </h5>

        <p
          className="card-text flex-grow-1 mt-1"
          style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.4" }}
        >
          {service.description?.length > 100
            ? service.description.slice(0, 100) + "..."
            : service.description}
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-success fw-bold">₹{service.price}</span>
            <small className="text-muted">By {service.provider}</small>
          </div>

          {isCustomer ? (
            <Link
              to={`/book/${service._id}`}
              className="btn btn-primary w-100 rounded-pill shadow-sm"
            >
              Book Now
            </Link>
          ) : (
            <button className="btn btn-outline-secondary w-100 rounded-pill" disabled>
              Customers Only
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
