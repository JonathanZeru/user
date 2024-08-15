import express, { json } from 'express';
import bcrypt from 'bcrypt';
import pool from './database.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.APP_PORT;

app.use(json());

// Endpoint to get all users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results);
  });
});

app.post('/users', async (req, res) => {
  const { firstName, lastName, email, age, password, username } = req.body;

  if (!firstName || !lastName || !email || !age || !password || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      'INSERT INTO user (firstName, lastName, email, age, password, username, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [firstName, lastName, email, age, hashedPassword, username ],
      (err, results) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Error creating user' });
        }
        res.status(201).json({ message: 'User created successfully', userId: results });
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Error hashing password' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
