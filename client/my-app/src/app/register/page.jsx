"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation"; 


export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/auth/register', { // غيّر الرابط حسب سيرفرك
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMessage(data.message);
    if(res.ok) setTimeout(() => router.push("/login"), 1000);

  };

  return (
    <form onSubmit={handleSubmit} className='container my-5 w-75'>
      <h1 className='text-center fs-1 fw-bolder mb-4'> انشاء حساب</h1>
      <div className="mb-3">
        <label className="form-label">اسم المستخدم</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">كلمة المرور</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">انشاء حساب</button>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </form>
  );
}
