const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ================= PATHS =================
const flowersPath = path.join(__dirname, "data", "flowers.json");

// ================= API =================

// GET ALL FLOWERS
app.get("/api/flowers", (req, res) => {
  try {
    const rawData = fs.readFileSync(flowersPath, "utf8");
    const data = JSON.parse(rawData);

    if (!data.flowers || !Array.isArray(data.flowers)) {
      return res.status(500).json({ error: "Invalid flowers.json structure" });
    }

    res.json(data.flowers);
  } catch (err) {
    res.status(500).json({ error: "Cannot read flowers.json" });
  }
});

// SEARCH
app.get("/api/search", (req, res) => {
  try {
    const { q, minPrice, maxPrice } = req.query;
    const rawData = fs.readFileSync(flowersPath, "utf8");
    let flowers = JSON.parse(rawData).flowers;

    if (q) {
      flowers = flowers.filter(f =>
        f.name.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (minPrice) flowers = flowers.filter(f => f.price >= Number(minPrice));
    if (maxPrice) flowers = flowers.filter(f => f.price <= Number(maxPrice));

    res.json(flowers);
  } catch (err) {
    res.status(500).json({ error: "Search error" });
  }
});

app.get("/product/:id", (req, res) => {
    const id = req.params.id;
    const rawData = fs.readFileSync(path.join(__dirname, "data", "flowers.json"), "utf8");
    const flower = JSON.parse(rawData).flowers.find(f => f.id === id);

    if (!flower) return res.status(404).send("Букет не знайдено");

    res.send(`
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${flower.name}</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <header style="padding:20px; text-align:center;">
                <a href="/index.html">← Повернутися до каталогу</a>
            </header>
            <main class="product-page">
                <h1>${flower.name}</h1>
                <img src="${flower.image}" alt="${flower.name}" style="max-width:400px; margin-bottom:20px;">
                <p>${flower.description}</p>
                <p>Розмір: ${flower.size}</p>
                <p>Ціна: ${flower.price} грн</p>
            </main>
        </body>
        </html>
    `);
});


// ADD FLOWER
app.post("/api/flowers", (req, res) => {
  try {
    const rawData = fs.readFileSync(flowersPath, "utf8");
    const data = JSON.parse(rawData);

    const newFlower = req.body;
    if (!newFlower.name || !newFlower.price) {
      return res.status(400).json({ error: "Missing fields" });
    }

    data.flowers.push(newFlower);
    fs.writeFileSync(flowersPath, JSON.stringify(data, null, 2), "utf8");

    res.status(201).json(newFlower);
  } catch (err) {
    res.status(500).json({ error: "Write error" });
  }
});

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "../public")));

// ================= ROUTES =================
// Завжди віддавати index.html при заході на /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`🌸 MyFloraSpace → http://localhost:${PORT}`);
});
