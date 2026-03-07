const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql-36113c53-premapleasant-1566.a.aivencloud.com',
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS__oK_8iDit7mNniM9F7W',
    database: process.env.DB_NAME || 'defaultdb',
    port: process.env.DB_PORT || 16650,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
