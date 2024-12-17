require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/sqlConfig");
const sql = require('mssql');
const accountRoutes = require("./routes/accountRoutes");
const fileRoutes = require("./routes/fileRoutes");
const printerRoutes = require("./routes/printerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adjustRoutes = require("./routes/adjustRoutes");
const printHistoryRoutes = require("./routes/printhistoryRoutes");
// Import thêm các routes khác nếu cần

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());  

// Sử dụng các routes
app.use("/api/account", accountRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/printers", printerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/adjust", adjustRoutes);
app.use("/api/history", printHistoryRoutes);




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
