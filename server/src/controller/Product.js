const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
const { validateCreateProductSchema } = require('../model/Product');

module.exports = {
    createProduct: asyncHandler(async (req, res) => {
        const { error } = validateCreateProductSchema(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, status, quantity } = req.body;

        try {
            // البحث عن المنتج
            const existingProduct = await new Promise((resolve, reject) => {
                db.get(
                    "SELECT * FROM product WHERE name = ? AND status = ?",
                    [name, status],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });

            if (existingProduct) {
                // تحديث الكمية في المنتج
                const newQuantity = existingProduct.quantity + quantity;

                await new Promise((resolve, reject) => {
                    db.run(
                        "UPDATE product SET quantity = ? WHERE name = ? AND status = ?",
                        [newQuantity, name, status],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });

                // حفظ سجل العملية في جدول السجل
                await new Promise((resolve, reject) => {
                    db.run(
                        "INSERT INTO product_log (name, status, quantity, user_id) VALUES (?, ?, ?, ?)",
                        [name, status, quantity, req.user.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });

                // إنشاء إشعار بتحديث المنتج
                await new Promise((resolve, reject) => {
                    const notifMessage = `تم تحديث كمية المنتج ${name} (${status}) بمقدار ${quantity}`;
                    db.run(
                        "INSERT INTO notifications (message, status, user_id) VALUES (?, ?, ?)",
                        [notifMessage, status, req.user.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });

                return res.status(200).json({
                    message: "تم تحديث الكمية وحفظ السجل.",
                    product: { name, status, quantity: newQuantity }
                });
            }

            // إدراج منتج جديد
            await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO product (name, status, quantity, user_id) VALUES (?, ?, ?, ?)",
                    [name, status, quantity, req.user.id],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            // حفظ السجل أيضًا
            await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO product_log (name, status, quantity, user_id) VALUES (?, ?, ?, ?)",
                    [name, status, quantity, req.user.id],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            // إنشاء إشعار بإضافة المنتج الجديد
            await new Promise((resolve, reject) => {
                const notifMessage = `تمت إضافة منتج جديد: ${name} (${status}) بكمية ${quantity}`;
                db.run(
                    "INSERT INTO notifications (message, status, user_id) VALUES (?, ?, ?)",
                    [notifMessage, status, req.user.id],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            return res.status(201).json({
                message: "تمت إضافة المنتج وحفظ السجل.",
                product: { name, status, quantity }
            });

        } catch (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات." });
        }
    }),

    allprod: asyncHandler(async (req, res) => {
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
                "SELECT * FROM product WHERE name = ? OR status = ?",
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
    })
};
