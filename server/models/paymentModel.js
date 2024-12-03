const connectDB = require("../config/sqlConfig");

const createPayment = async (email, pagesToBuy, totalAmount, status) => {
  const pool = await connectDB();

  await pool.request()
    .input("email",  email)
    .input("pagesToBuy",  pagesToBuy)
    .input("totalAmount",  totalAmount)
    .input("status",  status)
    .query(`
      INSERT INTO payments (email, pages_to_buy, total_amount, status)
      VALUES (@email, @pagesToBuy, @totalAmount, @status)
    `);
};

const getPaymentHistoryByEmail = async (email) => {
    const pool = await connectDB();
  
    const result = await pool.request()
      .input("email",  email)
      .query(`
        SELECT pages_to_buy, total_amount, status, created_at
        FROM payments
        WHERE email = @email
        ORDER BY created_at DESC
      `);
  
    return result.recordset;
  };
  


module.exports = { createPayment, getPaymentHistoryByEmail, };