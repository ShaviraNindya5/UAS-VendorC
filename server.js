const express = require('express');
const fs = require('fs');
require('dotenv').config();
const { Client } = require('pg');

const app = express();
app.use(express.json());

// Koneksi NeonDB
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Endpoint GET /products
app.get('/products', async (req, res) => {
  try {
    await client.connect();

    // Ambil data dari tabel products_json
    const result = await client.query('SELECT * FROM products_json');
    const products = result.rows.map(item => {
      // Copy struktur nested object
      const product = {
        id: item.id,
        details: { ...item.details },
        pricing: { ...item.pricing },
        stock: item.stock
      };

      // Tambahkan label "(Recommended)" jika category = "Food"
      if (product.details.category === 'Food') {
        product.details.name += ' (Recommended)';
      }

      return product;
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
