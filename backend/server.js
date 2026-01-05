import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin:process.env.ORIGIN , 
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

function getWorkingDays(startMonth, startYear, endMonth, endYear) {
  const workingDays = [];
  const startDate = new Date(startYear, startMonth - 1, 1);
  const endDate = new Date(endYear, endMonth, 0); // last day of endMonth

  let current = new Date(startDate);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  while (current <= endDate) {
  const y = current.getDay(); // 0 = Sunday
  if (y !== 0) {
    const yyy = current.getFullYear();
    const mm = String(current.getMonth()+1).padStart(2,"0");
    const dd = String(current.getDate()).padStart(2,"0");
    workingDays.push({
        date: `${yyy}-${mm}-${dd}`,
        day: days[y],
        status: null
    });
}
current.setDate(current.getDate() + 1);
}
return workingDays;
}
/* ---------- AUTH ROUTES ---------- */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ status: "failed", message: "Email exists" });

  const hashed = await hash(password, await genSalt(10));
  await User.create({ id: Date.now(), name, email, password: hashed, days: getWorkingDays(12,2025,4,2026) });
  res.json({ status: "success" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ status: "failed", message: "Invalid email" });

  const ok = await compare(password, user.password);
  if (!ok) return res.status(401).json({ status: "failed", message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

  res.json({ status: "success", token });
});

/* ---------- AUTH MIDDLEWARE ---------- */
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  try{
  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.id = decoded.id;
  next();
  }
  catch(e){
    res.status(402).json({message:"Token is expired ",status:"failed"})
  }
  
};

/* ---------- ATTENDANCE ---------- */
app.get("/api/attendance", verifyToken, async (req, res) => {
    const id = req.id;
    const data = await User.findOne({id});
    if(!data) return res.status(401).json({message:"User is not found",status:"failed"});
    const today = new Date();
    const filter = data.days.filter(d => new Date(d.date)<= today)
    const k = {name:data.name,email:data.email,days:filter.reverse()};
    res.status(200).json({message:"Data get successfully",status:"success",data:k});

})

app.put("/api/update",verifyToken,async(req,res) => {
    const id = req.id;
    const user = await User.findOne({id});
    if(!user) return res.status(301).json({message:"User not found",status:"failed"});
    const update = req.body;
    const updated = user.days.map(d => {
        const us = update.find(f => f.date == d.date);
        return us?{...d,status:us.status}:d;
    })
    user.days = updated;
    await user.save();
    const today = new Date();
    const filter = user.days.filter(d => new Date(d.date)<= today);
    const k = {name:user.name,email:user.email,days:filter.reverse()};
    res.status(200).json({message:"Updated successfully",status:"success",data:k});
})
                         

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
