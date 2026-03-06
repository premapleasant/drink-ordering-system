const express = require('express');
const router = express.Router();
const pool = require('../db');

// --- PRODUCTS API ---

// GET /api/products
router.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST /api/products
router.post('/products', async (req, res) => {
    const { name, price, stock_quantity } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, price, stock_quantity) VALUES (?, ?, ?)',
            [name, price, stock_quantity || 0]
        );
        res.status(201).json({ id: result.insertId, name, price, stock_quantity: stock_quantity || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT /api/products/:id
router.put('/products/:id', async (req, res) => {
    const { name, price } = req.body;
    try {
        await pool.query(
            'UPDATE products SET name = ?, price = ? WHERE id = ?',
            [name, price, req.params.id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id
router.delete('/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// --- STOCK API ---

// PUT /api/stock/:id
router.put('/stock/:id', async (req, res) => {
    const { stock_quantity } = req.body;
    try {
        await pool.query(
            'UPDATE products SET stock_quantity = ? WHERE id = ?',
            [stock_quantity, req.params.id]
        );
        res.json({ message: 'Stock updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// --- ORDERS API ---

// POST /api/orders
// Expected body: { productId: 1, quantity: 1 }
router.post('/orders', async (req, res) => {
    const { productId, quantity } = req.body;
    const qtyToOrder = quantity || 1;
    
    // We need a transaction to ensuring we check and deduct atomically
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check stock
        const [rows] = await connection.query(
            'SELECT stock_quantity, name FROM products WHERE id = ? FOR UPDATE',
            [productId]
        );

        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = rows[0];
        
        if (product.stock_quantity < qtyToOrder) {
            await connection.rollback();
            return res.status(400).json({ 
                error: 'Insufficient stock', 
                available: product.stock_quantity,
                message: `Sorry, we only have ${product.stock_quantity} left of ${product.name}.`
            });
        }

        // Deduct
        await connection.query(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
            [qtyToOrder, productId]
        );

        await connection.commit();
        res.json({ 
            message: 'Order placed successfully', 
            remainingStock: product.stock_quantity - qtyToOrder 
        });

    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: 'Failed to process order' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
