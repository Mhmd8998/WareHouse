const db = require("../DB/db");

// استعلام المدخلات خلال الفترة بين start و end
function getWeeklyProductInputs(start, end, callback) {
  const query = `
    SELECT * FROM product_log
    WHERE timestamp BETWEEN datetime(?) AND datetime(?)
    ORDER BY timestamp DESC
  `;
  db.all(query, [start, end], callback);
}

// استعلام السحوبات خلال الفترة بين start و end
function getWeeklyWithdrawals(start, end, callback) {
  const query = `
    SELECT * FROM product_withdrawal
    WHERE timestamp BETWEEN datetime(?) AND datetime(?)
    ORDER BY timestamp DESC
  `;
  db.all(query, [start, end], callback);
}

// تجميع الكميات حسب اسم المنتج من جدول المدخلات خلال الفترة بين start و end
function getTotalInputByProduct(start, end, callback) {
  const query = `
    SELECT name, SUM(quantity) as total_quantity
    FROM product_log
    WHERE timestamp BETWEEN datetime(?) AND datetime(?)
    GROUP BY name
  `;
  db.all(query, [start, end], callback);
}

// تجميع الكميات حسب اسم المنتج من جدول السحوبات خلال الفترة بين start و end
function getTotalWithdrawalByProduct(start, end, callback) {
  const query = `
    SELECT p.name, SUM(w.quantity) as total_quantity
    FROM product_withdrawal w
    JOIN product p ON p.id = w.product_id
    WHERE w.timestamp BETWEEN datetime(?) AND datetime(?)
    GROUP BY p.name
  `;
  db.all(query, [start, end], callback);
}

module.exports = {
  getWeeklyProductInputs,
  getWeeklyWithdrawals,
  getTotalInputByProduct,
  getTotalWithdrawalByProduct
};
