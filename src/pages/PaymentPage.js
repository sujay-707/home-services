import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './PaymentPage.css';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data) setBooking(res.data);
        else throw new Error("Booking not found");
      } catch (err) {
        console.error("Error fetching booking:", err);
        alert("Could not fetch booking. Redirecting to home.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  // ✅ Prevent crashes — don't render booking info until fully loaded
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Booking not found!</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    if (!booking) return;
    setProcessing(true);

    if (method === 'card' && card.number.replace(/\s/g, '').length < 12) {
      alert('Enter valid card number');
      setProcessing(false);
      return;
    }

    const txnId = 'TXN' + Date.now();
    try {
      const update = {
        paid: true,
        payment: {
          method,
          amount: booking?.serviceId?.price || booking?.price || 0,
          txnId,
          paidAt: new Date(),
        },
      };

      await api.put(`/bookings/${bookingId}`, update);
      setTimeout(() => {
        generateReceiptImage(booking, update.payment);
      }, 300);
      alert('Payment successful! Receipt will be downloaded.');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  // 🧾 Generate the receipt (same as before)
  const generateReceiptImage = (bookingData, paymentData) => {
    const width = 800;
    const height = 600;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0d6efd';
    ctx.fillRect(0, 0, width, 100);

    ctx.fillStyle = '#fff';
    ctx.font = '26px Arial';
    ctx.fillText('Home Services - Payment Receipt', 25, 55);

    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.fillText(`Customer: ${bookingData.customerName}`, 30, 140);
    ctx.fillText(`Service: ${bookingData?.serviceId?.name || 'N/A'}`, 30, 170);
    ctx.fillText(`Date: ${new Date(bookingData.date).toLocaleDateString()}`, 30, 200);
    ctx.fillText(`Address: ${bookingData.address}`, 30, 230);
    ctx.fillText(`Contact: ${bookingData.contact}`, 30, 260);

    ctx.fillText(`Transaction ID: ${paymentData.txnId}`, 30, 310);
    ctx.fillText(`Payment Method: ${paymentData.method}`, 30, 340);
    ctx.fillText(`Amount Paid: ₹${paymentData.amount}`, 30, 370);
    ctx.fillText(`Paid At: ${new Date(paymentData.paidAt).toLocaleString()}`, 30, 400);

    ctx.fillStyle = '#555';
    ctx.font = '14px Arial';
    ctx.fillText('Thank you for using Home Services!', 30, height - 40);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${paymentData.txnId}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: 900 }}>
      <h3 className="mb-3">Payment</h3>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Booking Summary</h5>
            <p><strong>Service:</strong> {booking.serviceId?.name}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Contact:</strong> {booking.contact}</p>
            <p><strong>Amount:</strong> ₹{booking.serviceId?.price}</p>
            <p><strong>Status:</strong> {booking.paid ? (
              <span className="text-success">Paid</span>
            ) : (
              <span className="text-warning">Pending</span>
            )}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Payment Method</h5>

            <div className="mb-3">
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">NetBanking</option>
              </select>
            </div>

            {method === 'card' && (
              <div className="mb-2">
                <input
                  className="form-control mb-2"
                  placeholder="Card number"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
                <div className="d-flex">
                  <input
                    className="form-control me-2"
                    placeholder="Name on card"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                  <input
                    className="form-control me-2"
                    placeholder="MM/YY"
                    style={{ maxWidth: 100 }}
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: e.target.value })}
                  />
                  <input
                    className="form-control"
                    placeholder="CVV"
                    style={{ maxWidth: 90 }}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  />
                </div>
              </div>
            )}

            {method === 'upi' && (
              <input className="form-control" placeholder="example@upi" />
            )}

            {method === 'netbanking' && (
              <select className="form-select">
                <option>Bank of India</option>
                <option>State Bank</option>
                <option>HDFC</option>
              </select>
            )}

            <button
              className="btn btn-success w-100 mt-3"
              disabled={processing}
              onClick={handlePay}
            >
              {processing ? 'Processing...' : `Pay ₹${booking.serviceId?.price || 0}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
