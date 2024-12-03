const express = require("express");
const { fetchPrinters, handlePrintRequest, getPrintHistory } = require("../controllers/printerController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/print", verifyToken, handlePrintRequest);
router.get("/history", verifyToken, getPrintHistory);
router.get("/", fetchPrinters);

module.exports = router;
