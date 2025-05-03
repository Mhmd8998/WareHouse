
import styles from "./page.module.css";
import Image from "next/image";
import waho from "../../public/3DWAHO.jpg"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <div className="container text-center justify-content-center">
        <div className="row">
          <div className="col">
            <Image className="rounded border border-primary" src={waho} width={550} alt="mage" />
          </div>
          <div className="col align-self-center">
           تطبيق المستودع هو نظام برمجي يُستخدم لإدارة المخزون والعمليات اللوجستية داخل المستودعات، مثل تتبع المنتجات، تسجيل الكميات، عمليات الإدخال والإخراج، وتنظيم مواقع التخزين. يهدف التطبيق إلى تحسين كفاءة العمل وتقليل الأخطاء البشرية من خلال أتمتة العمليات وتوفير تقارير دقيقة في الوقت الفعلي. كما يدعم التطبيق غالبًا صلاحيات متعددة للمستخدمين، وربطاً بأنظمة البيع أو الشراء لتوفير إدارة شاملة لسلسلة الإمداد

          </div>
          
        </div>
      </div>
      </main>
    </div>
  );
}
