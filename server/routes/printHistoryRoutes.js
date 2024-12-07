const express = require("express");
const { getPrintHistoryController } = require("../controllers/printhistoryController");

const router = express.Router();

// Định nghĩa route để lấy lịch sử in
router.get("/", getPrintHistoryController);

module.exports = router;
