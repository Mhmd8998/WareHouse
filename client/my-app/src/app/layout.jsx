import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "المستودع",
  description: "المستودع",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <nav className="navbar navbar-expand-lg  bg-primary ">
  <div className="container-fluid justify-content-around ">
    <a className="navbar-brand text-white" href="#">المستودع</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse justify-content-evenly" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active text-white" aria-current="page" href="#">الرئيسية</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">الادخال </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">الاخراج</a>
        </li>
        
      </ul>
      <li className="d-flex flex-row justify-content-between align-items-center">
          <a className="btn btn-outline-light  mx-2" href="#">تسجيل الدخول</a>
          <br/>
          <a className="btn btn-outline-light " href="#">انشاء حساب </a>
        </li>
    </div>
  </div>
</nav>
        {children}
        <div className="card text-center">
  <div className="card-header">
    <ul className="nav nav-tabs card-header-tabs">
      <li className="nav-item">
        <a className="nav-link active" aria-current="true" href="#">عنا</a>
      </li>
    </ul>
  </div>
  <div className="card-body ">
    <h5 className="card-title fw-bold">تطبيق المستودع</h5>
    <p className="card-text fs-6 fst-italic  mx-5" >تطبيق المستودع هو نظام برمجي يُستخدم لإدارة المخزون والعمليات اللوجستية داخل المستودعات، مثل تتبع المنتجات، تسجيل الكميات، عمليات الإدخال والإخراج، وتنظيم مواقع التخزين. يهدف التطبيق إلى تحسين كفاءة العمل وتقليل الأخطاء البشرية من خلال أتمتة العمليات وتوفير تقارير دقيقة في الوقت الفعلي. كما يدعم التطبيق غالبًا صلاحيات متعددة للمستخدمين، وربطاً بأنظمة البيع أو الشراء لتوفير إدارة شاملة لسلسلة الإمداد.</p>

  </div>
</div>
      </body>
    </html>
  );
}
