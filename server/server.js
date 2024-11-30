const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json()); // To parse JSON request body
app.use(cors());

// SQL Server configuration
const sqlConfig = {
  user: 'sa', // Your SQL Server username
  password: 'huy1202', // Your SQL Server password
  server: 'localhost', // SQL Server hostname (use 'localhost' for local SQL Server)
  database: 'AccountDB', // Database name
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // For local development (can be false for production)
  },
};

// Login endpoint
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to SQL Server
    const pool = await sql.connect(sqlConfig);
    
    // Query the database for the user by email
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM account WHERE email = @email');

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    // Compare the provided password with the plaintext password in the database
    if (password !== user.password) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, 'your_jwt_secret_key', { expiresIn: "1h" });

    // Send response with the token
    res.status(200).json({ token });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during authentication" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
