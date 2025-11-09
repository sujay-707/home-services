import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AddService() {
  const emptyForm = { name: '', category: '', description: '', price: '', provider: '', image: '' };
  const [form, setForm] = useState(emptyForm);
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load services
  const fetchServices = async () => {
    setFetching(true);
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load services');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      alert('Please fill name, category and price');
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/services/${editId}`, { ...form, price: Number(form.price) });
        alert('Service updated');
      } else {
        await api.post('/services', { ...form, price: Number(form.price) });
        alert('Service added');
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditId(s._id);
    setForm({
      name: s.name || '',
      category: s.category || '',
      description: s.description || '',
      price: s.price || '',
      provider: s.provider || '',
      image: s.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      alert('Service deleted');
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{editId ? 'Edit Service' : 'Add Service'}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: 900 }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name *</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Category *</label>
            <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Price (₹) *</label>
            <input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Provider</label>
            <input name="provider" className="form-control" value={form.provider} onChange={handleChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Image URL</label>
            <input name="image" className="form-control" value={form.image} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <button className={`btn ${editId ? 'btn-success' : 'btn-primary'}`} type="submit" disabled={loading}>
          {loading ? 'Saving...' : (editId ? 'Update Service' : 'Add Service')}
        </button>
        {editId && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>}
      </form>

      <hr />

      <h3 className="mb-3">All Services</h3>
      {fetching ? (
        <p>Loading services...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Provider</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s._id}>
                  <td style={{ width: 120 }}>
                    <img
                      src={s.image || 'https://via.placeholder.com/120x70'}
                      alt={s.name}
                      style={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 6 }}
                    />
                  </td>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>₹{s.price}</td>
                  <td>{s.provider || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No services added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
