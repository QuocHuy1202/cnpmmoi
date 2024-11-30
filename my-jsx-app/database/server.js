const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());

const config = {
  user: 'sa',
  password: 'huy1202',
  server: 'localhost',
  database: 'cnpm',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

app.get('/api/employees', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM dbo.GetQuizScoresByTeacher(1)');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/login', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Account;');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    //const { username, password } = req.body;
    const query = "SELECT * FROM Account WHERE user_name = 'john_doe' AND password = 'pass123'";
    const result = await pool.request().query("SELECT * FROM Account WHERE user_name = 'john_doe' AND password = 'pass123'");
    console.log(result.recordset.length);
    res.status(200).json({ message: 'Login successful' });
    /*if (result.recordset.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }*/
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});