const db = require('../DB/db');
const cron = require('node-cron');

// تشغيل الكرون في أول يوم من كل شهر الساعة 01:00 صباحًا
cron.schedule('0 1 1 * *', async () => {
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

    const insertReport = (type, data) => {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO weekly_report (report_date, type, data) VALUES (?, ?, ?)",
          [currentDate, type, JSON.stringify(data)],
          (err) => (err ? reject(err) : resolve())
        );
      });
    };

    const sendNotification = (message) => {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO notifications (message, user_id, type) VALUES (?, ?, ?)",
          [message, 1, 'report'],
          (err) => (err ? reject(err) : resolve())
        );
      });
    };

    if (withdrawals.length > 0) {
      await insertReport('monthly_withdrawal', withdrawals);
      await sendNotification(`تم إنشاء تقرير السحب الشهري بتاريخ ${currentDate}`);
    }

    if (logs.length > 0) {
      await insertReport('monthly_log', logs);
      await sendNotification(`تم إنشاء تقرير الإدخال الشهري بتاريخ ${currentDate}`);
    }

    console.log(`✅ تم إنشاء التقرير الشهري بتاريخ ${currentDate}`);

  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء التقرير الشهري:", error);
  }
});
