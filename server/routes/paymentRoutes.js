const express = require("express");
const { processPayment, getPaymentHistory } = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint xử lý thanh toán
router.get("/payment-history", verifyToken, getPaymentHistory);
router.post("/", verifyToken, processPayment);

module.exports = router;
