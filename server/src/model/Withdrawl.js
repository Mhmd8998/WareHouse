const db = require("../DB/db");
const joi = require("joi");

// إنشاء الجدول بعد التأكد من وجود جدول user مسبقًا
db.run(`CREATE TABLE IF NOT EXISTS product_withdrawal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    recipient TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    note TEXT,  -- ملاحظة السحب
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`);

db.run(` CREATE TABLE IF NOT EXISTS weekly_report (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_date DATE NOT NULL,
  type TEXT NOT NULL, -- مثل weekly_withdrawal أو monthly_log
  data TEXT NOT NULL, -- سيتم تخزين البيانات على شكل JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
)`);
db.run(`CREATE TABLE IF NOT EXISTS monthly_report (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_date DATE NOT NULL,
  type TEXT NOT NULL, -- مثل weekly_withdrawal أو monthly_log
  data TEXT NOT NULL, -- سيتم تخزين البيانات على شكل JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
)`);


const validateCreateWithdrawl = (obj) => {
    const productSchema = joi.object({
        product_name: joi.string().trim().max(100).min(3).required(),
        note: joi.string().trim().max(200).min(3),
        status:joi.string().trim().max(50).min(3).required(),
        recipient:joi.string().trim().max(50).required(),
        quantity: joi.number().integer().min(1).required()
    });

    const schema = joi.object({
        products: joi.array().items(productSchema).min(1).required()
    });

    return schema.validate(obj);
};


module.exports = { validateCreateWithdrawl };
