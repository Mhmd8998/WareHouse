import styles from "./page.module.css";
import Image from "next/image";
import waho from "../../public/wa.jpg"
import box from "../../public/box1.png"
import bell from "../../public/bell.png"
import setting from "../../public/settings.png"

export default function Home() {
  return (
    <div className="container my-5">
      <main className={styles.main}>
        {/* القسم الترحيبي */}
        <div className="row align-items-center mb-5 d-flex flex-column">
          
          <div className="col-md-6  mb-5 text-dark">
            <h2 className="my-4 ">مرحبًا بك في تطبيق إدارة المستودع!</h2>
            <p className="my-3 ">
              نحن هنا لمساعدتك في تنظيم وتتبع جميع عمليات الإدخال والإخراج في مستودعك بكل سهولة ودقة...
            </p>
            <button className="btn btn-warning  shadow-sm px-4">ابدأ الآن</button>
          </div>
                <div className="w-100">
        <Image
          src={waho}
          alt="welcome image my-5 shadow"
          className="img-fluid w-100 rounded "
          style={{ maxHeight: "500px", objectFit: "cover" }} // يمكنك التعديل حسب الحاجة
        />
      </div>
        </div>

        {/* البطاقات */}
        <div className="row g-4 text-center">
          {/* بطاقة */}
          {[{
            icon: box,
            title: "تتبع دقيق لحركة المخزون",
            desc: "سجل وتابع عمليات الإدخال والإخراج بسهولة، واعرف الكمية المتوفرة دائمًا."
          },
          {
            icon: setting,
            title: "إدارة سهلة للمنتجات والمستودعات",
            desc: "أضف وعدل المنتجات والمستودعات، ونظم هيكل المخزون بوضوح."
          },
          {
            icon: bell,
            title: "تنبيهات فورية",
            desc: "احصل على إشعارات بنفاد أو زيادة الكمية لتجنب الانقطاعات أو الفائض."
          }].map((card, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 hover-shadow transition">
                <Image src={card.icon} width={70} alt={card.title} className="mb-3 mx-auto d-block" />
                <div className="card-body">
                  <h5 className="card-title ">{card.title}</h5>
                  <p className="card-text text-muted">{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
