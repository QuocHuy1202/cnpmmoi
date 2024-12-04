const express = require("express");
const { getAllowedFileTypes, deleteAllowedFile, addFileFormatController, getCurrentStatus, saveDate, } = require("../controllers/adjustController");

const router = express.Router();

router.get("/allowed-files", getAllowedFileTypes);
router.delete('/delete-file/:id', deleteAllowedFile);
router.post('/add-file', addFileFormatController);
router.get('/current-status', getCurrentStatus);
router.post('/save-config', saveDate);

module.exports = router;
