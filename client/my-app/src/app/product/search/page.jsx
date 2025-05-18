"use client"
import { useState, useEffect } from "react";

export default function Search() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSearch = async () => {
    setMessage(""); // مسح الرسائل السابقة
    const requestBody = { name, status };
    try {
      // البحث في المنتجات
      const res = await fetch("http://localhost:8000/api/product/search/", {
        method: "POST", // تأكد أن الطريقة هي POST أو GET
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), // إرسال البيانات في الجسم (body)
      });
  
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setMessage(data.message || "حدث خطأ أثناء البحث في المنتجات");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ غير متوقع");
    }
  };
  

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4">بحث المنتجات والسحوبات</h2>

      {/* نموذج البحث */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="form-select mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">الكل</option>
          <option value="جديد">جديد</option>
          <option value="مستعمل">مستعمل</option>
          <option value="تالف">تالف</option>
        </select>
        <button onClick={handleSearch} className="btn btn-warning">
          بحث
        </button>
      </div>

      {/* عرض الرسائل */}
      {message && <div className="alert alert-warning">{message}</div>}

      {/* جدول عرض المنتجات */}
      {products.length > 0 && (
        <div>
          <h4>المنتجات</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>اسم المنتج</th>
                <th>الحالة</th>
                <th>الكمية</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.status}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* جدول عرض السحوبات */}
      {withdrawals.length > 0 && (
        <div className="mt-4">
          <h4>السحوبات</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>اسم المنتج</th>
                <th>الحالة</th>
                <th>الكمية</th>
                <th>الملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal, index) => (
                <tr key={index}>
                  <td>{withdrawal.product_name}</td>
                  <td>{withdrawal.status}</td>
                  <td>{withdrawal.quantity}</td>
                  <td>{withdrawal.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
