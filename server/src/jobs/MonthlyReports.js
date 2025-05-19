const db = require('../DB/db');
const cron = require('node-cron');

// تشغيل الكرون في أول يوم من كل شهر الساعة 01:00 صباحًا
cron.schedule('0 1 16 * *', async () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // عمليات السحب خلال آخر 30 يوم
    const withdrawals = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM product_withdrawal WHERE DATE(timestamp) >= DATE('now', '-30 days')",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    // عمليات الإدخال خلال آخر 30 يوم
    const logs = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM product_log WHERE DATE(timestamp) >= DATE('now', '-30 days')",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (withdrawals.length > 0) {
      await db.run(
        "INSERT INTO weekly_report (report_date, type, data) VALUES (?, ?, ?)",
        [currentDate, 'monthly_withdrawal', JSON.stringify(withdrawals)],
        (err) => { if (err) console.error(err); }
      );
    }

    if (logs.length > 0) {
      await db.run(
        "INSERT INTO weekly_report (report_date, type, data) VALUES (?, ?, ?)",
        [currentDate, 'monthly_log', JSON.stringify(logs)],
        (err) => { if (err) console.error(err); }
      );
    }

    console.log(`تم إنشاء التقرير الشهري بتاريخ ${currentDate}`);
    await db.run(
  "INSERT INTO notifications (message, user_id, type) VALUES (?, ?, ?)",
  [`تم إنشاء تقرير ${نوع التقرير} بتاريخ ${currentDate}`, 1, 'report'],
  (err) => {
    if (err) console.error("خطأ أثناء إرسال إشعار:", err);
  }
);
  } catch (error) {
    
    console.error("خطأ أثناء إنشاء التقرير الشهري:", error);
  }
});
