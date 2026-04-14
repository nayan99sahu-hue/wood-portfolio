const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static(__dirname));

// connect MongoDB (Railway auto provides MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// schema
const Enquiry = mongoose.model("Enquiry", {
  name: String,
  phone: String,
  product: String,
  message: String
});

// API
app.post("/enquiry", async (req, res) => {
  try {
    const data = new Enquiry(req.body);
    await data.save();
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log("Server running"));