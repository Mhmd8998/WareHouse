const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
require("../jobs/MonthlyReports");
require("../jobs/WeeklyReports");


module.exports = {
    getAdminNotification: asyncHandler(async (req, res) => {
        // تحقق من كون المستخدم مسؤول
        

        try {
            const result = await new Promise((resolve, reject) => {
                db.all(
                    "SELECT * FROM notifications ORDER BY created_at DESC",
                    [],
                    (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    }
                );
            });

            if (result.length === 0) {
                return res.status(404).json({ message: "لم يتم العثور على إشعارات." });
            }

            return res.status(200).json({
                count: result.length,
                notifications: result
            });

        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات." });
        }
    }),
updateNotificationReadStatus: asyncHandler(async (req, res) => {
    const notificationId = req.params.id; // أو استخدم req.body.id إذا كان في الجسم
    if (!notificationId) {
        return res.status(400).json({ message: "رقم الإشعار غير موجود" });
    }

    try {
        // تحديث حالة الإشعار إلى "مقروء"
        db.run(`UPDATE notifications SET isRead = 1 WHERE id = ?`, [notificationId], function(err) {
            if (err) {
                console.error("Error updating notification status:", err);
                return res.status(500).json({ message: "حدث خطأ أثناء تحديث الإشعار" });
            }
            // إذا تم التحديث بنجاح
            if (this.changes > 0) {
                return res.status(200).json({ message: `تم تحديث حالة الإشعار ID ${notificationId} إلى مقروء.` });
            } else {
                return res.status(404).json({ message: "لم يتم العثور على الإشعار" });
            }
        });
    } catch (error) {
        console.error("Error in updateNotificationReadStatus:", error);
        return res.status(500).json({ message: "حدث خطأ غير متوقع." });
    }
}),


};
