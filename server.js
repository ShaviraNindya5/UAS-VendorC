const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Load data Vendor C dari file JSON
const dataPath = path.join(__dirname, "data", "vendorC.json");
let vendorData = [];

try {
  vendorData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // Tambahkan LabelKuliner: "(Recommended)" jika category = "Food"
  vendorData = vendorData.map(item => {
    if (item.details.category === "Food") {
      item.details.name += " (Recommended)";
    }
    return item;
  });

} catch (err) {
  console.error("Gagal memuat data Vendor C:", err);
  vendorData = [];
}

// Status endpoint
app.get("/", (req, res) => {
  res.json({
    ok: true,
    vendor: "Vendor C - Resto & Kuliner",
    total_products: vendorData.length
  });
});

// Endpoint RAW DATA JSON (nested object)
app.get("/api/products", (req, res) => {
  res.json(vendorData);
});

// Alias /products ke /api/products
app.get("/products", (req, res) => {
  res.json(vendorData);
});

// fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = 3300;
app.listen(port, () => {
  console.log(`Vendor C API running at http://localhost:${port}`);
});

module.exports = app;
