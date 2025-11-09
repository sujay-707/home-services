import React, {useEffect, useState} from 'react';
import api from '../api';

export default function ServiceDetails({ id }){
  const [service, setService] = useState(null);
  useEffect(()=> {
    if (!id) return;
    api.get('/services/' + id).then(r => setService(r.data)).catch(() => {});
  }, [id]);
  if (!service) return <div className="container mt-4">Loading...</div>;
  return (
    <div className="container mt-4">
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      <p><strong>Price:</strong> ₹{service.price}</p>
    </div>
  );
}
