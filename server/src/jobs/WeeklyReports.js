const db = require('../DB/db');
const cron = require('node-cron');

// تشغيل الكرون كل يوم خميس الساعة 12:00 ظهرًا
cron.schedule('0 12 * * 4', async () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // عمليات السحب خلال 7 أيام
    const withdrawals = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM product_withdrawal WHERE DATE(timestamp) >= DATE('now', '-7 days')",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    // عمليات الإدخال خلال 7 أيام
    const logs = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM product_log WHERE DATE(timestamp) >= DATE('now', '-7 days')",
        [],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (withdrawals.length > 0) {
      await db.run(
        "INSERT INTO weekly_report (report_date, type, data) VALUES (?, ?, ?)",
        [currentDate, 'withdrawal', JSON.stringify(withdrawals)],
        (err) => { if (err) console.error(err); }
      );
    }

    if (logs.length > 0) {
      await db.run(
        "INSERT INTO weekly_report (report_date, type, data) VALUES (?, ?, ?)",
        [currentDate, 'log', JSON.stringify(logs)],
        (err) => { if (err) console.error(err); }
      );
    }

    console.log(`تم إنشاء التقرير الأسبوعي بتاريخ ${currentDate}`);
  } catch (error) {
    console.error("خطأ أثناء إنشاء التقرير الأسبوعي:", error);
  }
});
