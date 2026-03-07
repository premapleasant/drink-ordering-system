require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(apiRoutes);

// Database check (optional)
const pool = require('./db');
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully.');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
