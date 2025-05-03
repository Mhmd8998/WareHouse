// hooks/useToken.js
'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [token, setToken] = useState(null);
  const handleLogout = () => {
    //حذف توكين في localStorage
    localStorage.setItem('token', "");
      //حذف ايدي المستخدم في localStorage
    localStorage.setItem('user_id', "");
  }
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg  bg-primary ">
    <div className="container-fluid justify-content-around ">
      <a className="navbar-brand text-white" href="/">المستودع</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-evenly" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link active text-white" aria-current="page" href="/">الرئيسية</a>
          </li>
         {token && (
          <div className='d-flex flex-row justify-content-between align-items-center'>
             <li className="nav-item">
                   <a className="nav-link text-white" href="#">الادخال </a>
            </li>
            <li className="nav-item">
                   <a className="nav-link text-white" href="#">الاخراج</a>
            </li>
          </div>                 
         ):(
          <button onClick={handleLogout} className="btn btn-danger">logout</button>
         )}
          
        </ul>
       {!token && (
         <li className="d-flex flex-row justify-content-between align-items-center">
         <a className="btn btn-outline-light  mx-2" href="/login">تسجيل الدخول</a>
         <br/>
         <a className="btn btn-outline-light " href="/register">انشاء حساب </a>
       </li>
       )

       }
      </div>
    </div>
  </nav>
  );
}
