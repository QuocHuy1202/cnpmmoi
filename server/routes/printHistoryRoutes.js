const express = require("express");
const {  fetchPrintHistory } = require("../controllers/printhistoryController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Định nghĩa route để lấy lịch sử in

router.get("/print-history", verifyToken("SPSO"), fetchPrintHistory);

module.exports = router;
