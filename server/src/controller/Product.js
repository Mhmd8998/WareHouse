const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
const {validateCreateProductSchema}=require('../model/Product')
module.exports = {
    createProduct: asyncHandler(async (req, res) => {
        const { error } = validateCreateProductSchema(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    
        let { name, status, quantity } = req.body;
    
        try {
            // البحث عن المنتج في قاعدة البيانات
            const existingProduct = await new Promise((resolve, reject) => {
                db.get("SELECT * FROM product WHERE name = ? AND status = ?", [name, status], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
    
            if (existingProduct) {
                // المنتج موجود: تحديث الكمية
                const newQuantity = existingProduct.quantity + quantity;
    
                await new Promise((resolve, reject) => {
                    db.run("UPDATE product SET quantity = ? WHERE name = ? AND status = ?", [newQuantity, name, status], function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO product (name, status, quantity, user_id) VALUES (?, ?, ?,?)",
                    [name, status, quantity, req.user.id],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
       
                return res.status(200).json({
                    message: "تمت العملية بنجاح .",
                    product: { name, status, quantity: newQuantity }
                });
            }
    
            // المنتج غير موجود: إدخاله
            await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO product (name, status, quantity, user_id) VALUES (?, ?, ?,?)",
                    [name, status, quantity, req.user.id],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
    
            return res.status(201).json({
                message: "تم العملية بنجاح.",
                product: { name, status, quantity }
            });
    
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات." });
        }
    }),
    
    

    allprod: asyncHandler(async (req, res) => {
        // استعلام لعرض جميع المنتجات
        db.all("SELECT * FROM product", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err.message });
            }
            return res.status(200).json(rows);
        });
    }),
    
gitwithname: asyncHandler(async (req, res) => {
    const { name, status } = req.body;

    if (!name && !status) {
        return res.status(400).json({ message: "يجب إدخال الاسم أو الحالة للبحث." });
    }

    
        const result = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM product WHERE name = ? OR status = ?`,
                [name, status],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        if (result.length === 0) {
            return res.status(404).json({ message: "لم يتم العثور على منتجات مطابقة." });
        }

        return res.status(200).json(result);
    
});
}
