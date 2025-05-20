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
          return res.status(400).json({ message: `الكمية المطلوبة أكبر من الكمية المتاحة للمنتج: ${product_name}` });
        }

        const newQuantity = product.quantity - quantity;

        await new Promise((resolve, reject) => {
          db.run("UPDATE product SET quantity = ? WHERE id = ?", [newQuantity, product.id], function (err) {
            if (err) reject(err);
            else resolve();
          });
        });

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO product_withdrawal (product_id, status, quantity,recipient, user_id, note) VALUES (?, ?, ?, ?, ?, ?)",
            [product.id, status, quantity, recipient, note || "لايوجد"],
            function (err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        await new Promise((resolve, reject) => {
          const notifMessage = `تم سحب ${quantity} من المنتج ${product_name} (${status}) إلى المستلم ${recipient}`;
          db.run(
            "INSERT INTO notifications (message, user_id) VALUES (?, ?)",
            [notifMessage, req.user.id], // تم استبدال user بـ users هنا
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        if (newQuantity < 3) {
          const lowStockMessage = `المنتج ${product_name} (${status}) أوشك على النفاد. الكمية الحالية: ${newQuantity}`;
          await new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO notifications (message, user_id) VALUES (?, ?)",
              [lowStockMessage, req.user.id], // تم استبدال user بـ users هنا
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }

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
        `SELECT pw.*, p.name 
         FROM product_withdrawal pw
         JOIN product p ON pw.product_id = p.id
         WHERE p.name = ? OR pw.status = ?`,
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
  }),

  filterWithdrawalsByDate: asyncHandler(async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية (from و to)." });
    }

    try {
      const results = await new Promise((resolve, reject) => {
        db.all(
          `SELECT pw.*, p.name 
           FROM product_withdrawal pw
           JOIN product p ON pw.product_id = p.id
           WHERE DATE(pw.timestamp) BETWEEN DATE(?) AND DATE(?) 
           ORDER BY pw.timestamp DESC`,
          [from, to],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      if (results.length === 0) {
        return res.status(404).json({ message: "لا توجد سحوبات ضمن الفترة المحددة." });
      }

      return res.status(200).json({
        count: results.length,
        data: results
      });

    } catch (error) {
      console.error("خطأ أثناء فلترة السحوبات:", error);
      return res.status(500).json({ message: "خطأ في قاعدة البيانات." });
    }
  }),

  exportWithdrawalReport: asyncHandler(async (req, res) => {
    try {
      const results = await new Promise((resolve, reject) => {
        db.all(
          `SELECT pw.*, p.name 
           FROM product_withdrawal pw
           JOIN product p ON pw.product_id = p.id
           ORDER BY pw.timestamp DESC`,
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      const fileName = `withdrawal_report_${Date.now()}.json`;
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/json');

      return res.send(JSON.stringify(results, null, 2));
    } catch (error) {
      console.error("خطأ في تصدير التقرير:", error);
      return res.status(500).json({ message: "فشل في تصدير التقرير." });
    }
  })
};
