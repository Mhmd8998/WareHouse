const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
require("../jobs/MonthlyReports");
require("../jobs/WeklyReports");


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
};
