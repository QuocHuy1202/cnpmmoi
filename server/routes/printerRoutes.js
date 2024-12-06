const express = require("express");
const { fetchPrinters, handlePrintRequest, getPrintHistory, addPrinter, deletePrinter, updatePrinterStatus} = require("../controllers/printerController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/print", verifyToken, handlePrintRequest);
router.get("/history", verifyToken, getPrintHistory);
router.get("/printers", fetchPrinters);
router.post("/addPrinter", addPrinter);
router.post("/deletePrinter", deletePrinter);
router.post("/updateStatus", updatePrinterStatus);

module.exports = router;
