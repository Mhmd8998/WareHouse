const db = require("../DB/db");
const joi = require("joi");

// إنشاء الجدول بعد التأكد من وجود جدول user مسبقًا
db.run(`CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS product_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    status TEXT,
    quantity INTEGER,
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

const validateCreateProductSchema = (obj) => {
    const schema = joi.object({
    name: joi.string().trim().max(100).min(3).required(),
    status:joi.string().trim().max(40).min(3).required(),
    quantity: joi.number().integer().min(1).required()
    });
    return schema.validate(obj);
};

module.exports = { validateCreateProductSchema };
