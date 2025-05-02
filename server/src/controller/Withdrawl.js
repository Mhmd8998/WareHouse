const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
const{validateCreateWithdrawl} = require('../model/Withdrawl');


module.exports = {
    createWithdrawal: asyncHandler(async (req, res) => {
        const { error } = validateCreateWithdrawl(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
    
        const { products } = req.body;
    
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products list is required and must not be empty." });
        }
    
        try {
            const withdrawnProducts = [];
    
            for (const item of products) {
                const { product_name, status, quantity, note } = item;
    
                // تحقق من أن الكمية رقم صالح وغير سالبة
                if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
                    return res.status(400).json({ message: `Invalid quantity for product: ${product_name}` });
                }
    
                // الحصول على المنتج من جدول المنتجات
                const product = await new Promise((resolve, reject) => {
                    db.get("SELECT * FROM product WHERE name = ? && status = ?", [product_name, status], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
    
                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${product_name}` });
                }
    
                if (product.quantity < quantity) {
                    return res.status(400).json({ message: `Not enough stock for product: ${product_name}` });
                }
    
                const newQuantity = product.quantity - quantity;
    
                // تحديث الكمية في جدول المنتجات
                await new Promise((resolve, reject) => {
                    db.run("UPDATE product SET quantity = ? WHERE id = ? && status = ?", [newQuantity, product.id,product.status], function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
    
                // إدخال عملية السحب في جدول السحب
                await new Promise((resolve, reject) => {
                    db.run(
                        "INSERT INTO product_withdrawal (product_id, status, quantity, user_id, note) VALUES (?, ?, ?, ?)",
                        [product.id, status, quantity, req.user.id, note || null],
                        function (err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
    
                // أضف السحب إلى النتيجة النهائية
                withdrawnProducts.push({
                    name: product_name,
                    quantity,
                    note: note || "No note provided"
                });
            }
    
            return res.status(201).json({
                message: "Products withdrawn successfully.",
                withdrawals: withdrawnProducts
            });
    
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error." });
        }
    }),
    gitWitdraw:asyncHandler(async (req,res)=>{
        db.all("SELECT * FROM product_withdrawal", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err.message });
            }
            return res.status(200).json(rows);
        });
    })
    
}
