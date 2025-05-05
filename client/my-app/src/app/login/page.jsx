"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation"; 


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();


  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Login successful');
      
      // يمكن تخزين التوكن في localStorage إذا أردت
      localStorage.setItem('token', data.token);
      //تخزين ايدي المستخدم في localStorage
      localStorage.setItem('user_id', data.user_id);
      setMessage(data.message);
      setTimeout(() => router.push("/"), 1000);

    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className='container w-75 my-5'>
      <h2>تسجيل الدخول</h2>
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
      <button type="submit" className="btn btn-primary w-100">تسجيل الدخول</button>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </form>
  );
}
