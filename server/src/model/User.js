const db = require("../DB/db");
const joi = require('joi');
db.run(`CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT 0
    )`);
db.run(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,   -- تأكد من أن الرسالة لا يمكن أن تكون فارغة
  user_id INTEGER,        -- معرف المستخدم المرتبط بالإشعار
  isRead INTEGER DEFAULT 0, -- تعيين القيمة الافتراضية إلى 0 (غير مقروء)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- الوقت الافتراضي هو الوقت الحالي
  FOREIGN KEY (user_id) REFERENCES users(id)  -- العلاقة مع جدول المستخدمين
)`);

    const validateRegisterUser = (obj) => {
        const schema = joi.object({
          username: joi.string().trim().max(100).min(3).required(),
          password: joi.string().trim().max(100).min(8).required()

        });
        return schema.validate(obj);
      };
      
      const validateLoginUser = (obj) => {
        const schema = joi.object({
          username: joi.string().trim().min(3).required(),
          password: joi.string().trim().min(6).required()
        });
        return schema.validate(obj);
      };
      

module.exports = {
    validateRegisterUser,
    validateLoginUser
}
