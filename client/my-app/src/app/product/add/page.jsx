"use client"
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"; 

export default function Login() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
     const storedToken = localStorage.getItem('token');
     if (storedToken) setToken(storedToken);
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/product/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, status, quantity }),
    });

    const data = await res.json();
    
    setMessage(data.message);
    if(res.ok) setTimeout(() => router.push("/"), 1000);
    else setMessage(data.message);
    
  };

  return (
    <form onSubmit={handleAddProduct} className='container w-75 my-5'>
      <h2>اضافة منتج</h2>
      <div className="mb-3">
        <label className="form-label">اسم المنتج</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">الحالة</label>
        <input
          type="text"
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">الكمية</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">اضافة</button>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </form>
  );
  }
