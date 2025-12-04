// seed.js
const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

// Koneksi ke NeonDB
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // NeonDB perlu SSL
});

// Fungsi untuk memasukkan data
async function seedData() {
  try {
    await client.connect();
    console.log('Terhubung ke NeonDB');

    // Baca data JSON
    const data = JSON.parse(fs.readFileSync('data/vendorC.json', 'utf8'));

    for (let item of data) {
      // Masukkan ke tabel products_json
      await client.query(
        `INSERT INTO products_json (id, details, pricing, stock)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [item.id, item.details, item.pricing, item.stock]
      );
      console.log(`Berhasil menambahkan: ${item.details.name}`);
    }

    console.log('Semua data berhasil di-seed!');
  } catch (err) {
    console.error('Error saat seed data:', err);
  } finally {
    await client.end();
  }
}

seedData();
