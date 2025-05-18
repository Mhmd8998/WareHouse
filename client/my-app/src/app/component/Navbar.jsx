// hooks/useToken.js
'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import war from "../../../public/war.png"

export default function Navbar() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    // حذف التوكين من localStorage
    localStorage.setItem('token', "");
    // حذف معرف المستخدم من localStorage
    localStorage.setItem('user_id', "");
    setToken(null); // تحديث الحالة لحذف التوكين من الواجهة
    window.location.reload()
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
    
  }, []);

  return (
    <nav id="navbar-example2" className="navbar bg-body-tertiary ">
  <div>
    <Image src={war} width={30} alt={"hello"}/>
    <a className="navbar-brand" href="">المستودع</a>
  </div>
  <ul className="nav nav-pills">
    <li className="nav-item">
      <a className="nav-link text-dark" href="/product/add">الأدخال</a>
    </li>
    <li className="nav-item">
      <a className="nav-link text-dark" href="/product/withdraw">الأخراج</a>
    </li>
        <li className="nav-item">
      <a className="nav-link text-dark" href="#scrollspyHeading2">المخزن</a>
    </li>
        <li className="nav-item">
      <a className="nav-link text-dark" href="/product/search">البحث</a>
    </li>
  </ul>
    <ul className='nav nav-pills'>
          <li className="nav-item">
      <a className="nav-link text-dark" href="/register">تسجيل</a>
    </li>
        <li className="nav-item">
      <a className="nav-link text-dark" href="/login">تسجيل دخول</a>
    </li>
    </ul>
</nav>

  );
}
