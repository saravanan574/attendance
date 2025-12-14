import express from "express";
import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://attendance-1-410u.onrender.com", // 🔴 CHANGE TO YOUR FRONTEND URL
  credentials: true
}));

const PORT = process.env.PORT || 5000;

/* ---------- DATABASE ---------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

/* ---------- MODEL ---------- */
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  days: [{
    date: String,
    day: String,
    status: { type: String, enum: ["Present", "Absent", "Holiday"], default: null }
  }]
});
const User = mongoose.model("user", userSchema);

/* ---------- AUTH ROUTES ---------- */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ status: "failed", message: "Email exists" });

  const hashed = await hash(password, await genSalt(10));
  await User.create({ id: Date.now(), name, email, password: hashed, days: [] });

  res.json({ status: "success" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ status: "failed", message: "Invalid email" });

  const ok = await compare(password, user.password);
  if (!ok) return res.status(401).json({ status: "failed", message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

  res.json({ status: "success", token });
});

/* ---------- AUTH MIDDLEWARE ---------- */
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.id = decoded.id;
  next();
};

/* ---------- ATTENDANCE ---------- */
app.get("/api/attendance", verifyToken, async (req, res) => {
  const user = await User.findOne({ id: req.id });
  if (!user) return res.sendStatus(401);
  res.json({ status: "success", data: user });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
