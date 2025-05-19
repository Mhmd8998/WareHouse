const db = require('../DB/db');
const asyncHandler = require("express-async-handler");
const { validateCreateWithdrawl } = require('../model/Withdrawl');

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
                const { product_name, status, recipient, quantity, note } = item;

                // الحصول على المنتج من جدول المنتجات
                const product = await new Promise((resolve, reject) => {
                    db.get("SELECT * FROM product WHERE name = ? AND status = ?", [product_name, status], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (!product) {
                    return res.status(404).json({ message: `المنتج غير موجود: ${product_name}` });
                }

                if (product.quantity < quantity) {
                    return res.status(400).json({ message: `عذرًا، الكمية التي أدخلتها أكبر من الكمية المتاحة في المنتج: ${product_name}` });
                }

                const newQuantity = product.quantity - quantity;

                // تحديث الكمية في جدول المنتجات
                await new Promise((resolve, reject) => {
                    db.run("UPDATE product SET quantity = ? WHERE id = ?", [newQuantity, product.id], function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // إدخال عملية السحب في جدول السحب
                await new Promise((resolve, reject) => {
                    db.run(
                        "INSERT INTO product_withdrawal (product_id, status, quantity, user_id, note) VALUES (?, ?, ?, ?, ?)",
                        [product.id, status, quantity, recipient, req.user.id, note || "لايوجد"],
                        function (err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });

                // إنشاء إشعار لعملية السحب
                await new Promise((resolve, reject) => {
                    const notifMessage = `تم سحب ${quantity} من المنتج ${product_name} (${status}) إلى المستلم ${recipient}`;
                    db.run(
                        "INSERT INTO notifications (message, status, user_id) VALUES (?, ?, ?)",
                        [notifMessage, status, req.user.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });

                // إضافة إلى قائمة النتائج
                withdrawnProducts.push({
                    name: product_name,
                    status,
                    quantity,
                    recipient,
                    note: note || "لا يوجد"
                });
            }

            return res.status(201).json({
                message: "تمت إضافة السحب بنجاح.",
                withdrawals: withdrawnProducts
            });

        } catch (error) {
            console.error("خطأ في قاعدة البيانات:", error);
            return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات" });
        }
    }),

    gitWitdraw: asyncHandler(async (req, res) => {
        db.all("SELECT * FROM product_withdrawal", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "خطأ في قاعدة البيانات", error: err.message });
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
                "SELECT * FROM product_withdrawal WHERE name = ? OR status = ?",
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
