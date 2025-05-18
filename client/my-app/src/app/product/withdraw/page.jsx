"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Withdraw() {
  const [products, setProducts] = useState([
    { product_name: "", quantity: 1, note: "", status: "جديد", recipient: "" },
  ]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const statusOptions = ["جديد", "مستعمل", "تالف"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    // نسخ الملاحظة والمستلم من المنتج الأول إلى باقي المنتجات
    if (index === 0 && (field === "note" || field === "recipient")) {
      for (let i = 1; i < updatedProducts.length; i++) {
        updatedProducts[i][field] = value;
      }
    }

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    const noteFromFirst = products[0]?.note || "";
    const recipientFromFirst = products[0]?.recipient || "";
    setProducts([
      ...products,
      { product_name: "", quantity: 1, note: noteFromFirst, status: "جديد", recipient: recipientFromFirst },
    ]);
  };

  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // تنظيف الرسالة السابقة

    if (!token) {
      setMessage("يرجى تسجيل الدخول أولاً");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/withdrawl/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "تم السحب بنجاح");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.message || "فشل في العملية");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4">سحب منتجات</h2>

      <form onSubmit={handleSubmit}>
        {products.map((product, index) => (
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">اسم المنتج:</label>
                <input
                  type="text"
                  className="form-control"
                  value={product.product_name}
                  onChange={(e) => handleProductChange(index, "product_name", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">الكمية:</label>
                <input
                  type="number"
                  className="form-control"
                  value={product.quantity}
                  min={1}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", parseInt(e.target.value))
                  }
                  required
                />
              </div>

              {index === 0 && (
                <>
                  <div className="mb-3">
                    <label className="form-label">الملاحظة:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.note}
                      onChange={(e) => handleProductChange(index, "note", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">المستلم:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.recipient}
                      onChange={(e) => handleProductChange(index, "recipient", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">الحالة:</label>
                <select
                  className="form-select"
                  value={product.status}
                  onChange={(e) => handleProductChange(index, "status", e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeProduct(index)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-secondary me-2" onClick={addProduct}>
            ➕ إضافة منتج آخر
          </button>
          <button type="submit" className="btn btn-success">
            📦 سحب المنتجات
          </button>
        </div>
      </form>

      {message && (
        <div className="alert alert-info text-center" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}
