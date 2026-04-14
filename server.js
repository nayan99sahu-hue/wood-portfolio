const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static(__dirname));

// 🔥 DEBUG: check env
console.log("MONGO_URL =", process.env.MONGO_URL);

// connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// schema
const Enquiry = mongoose.model("Enquiry", {
  name: String,
  phone: String,
  product: String,
  message: String
});

// API route (FIXED WITH ERROR LOGGING)
app.post("/enquiry", async (req, res) => {
  try {
    console.log("📩 Incoming data:", req.body);

    const data = new Enquiry(req.body);
    await data.save();

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Save error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});