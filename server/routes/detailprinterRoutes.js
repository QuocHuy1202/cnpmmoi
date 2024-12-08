const express = require("express");
const { getFullPrintHistoryController } = require("../controllers/detailprinterController");

const router = express.Router();

// Route: Lấy lịch sử in đầy đủ của máy in
router.get("/", getFullPrintHistoryController);

module.exports = router;
