import express, { urlencoded, json } from "express";
import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"
import cors from "cors";
import  dotenv  from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";

dotenv.config()
const app = express();

app.use(cors({
  origin:"https://attendance-1-410u.onrender.com/",credentials:true
}));
const PORT = process.env.PORT;
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const filename = fileURLToPath(import.meta.url);
const dir = path.dirname(filename);
const user = new mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    days:[{
        date:{type:String},day:{type:String},status:{type:String,enum:["Present","Absent","Holiday"],default:null}
    }]
})

const User = mongoose.model("user",user);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.get("/",(req,res) => {
    res.sendFile(path.join(dir,"..","frontend","index.html"));
})

app.post("/register",async(req,res) => {
    try {
        const { name,email,password} = req.body;
        let exists = await User.findOne({email });
        if (exists) {
          return res.status(400).json({ success: false, message: "Email is already registered" });
        }
    
        const id = Math.round(Date.now() * 100000);
        const salt = await genSalt(10);
        const pw = await hash(password,salt);
        // Create new user
        const newUser = new User({
          id,
          name,email,
          password:pw,
          days:getWorkingDays(12, 2025, 4, 2026)
        });
        const user = await newUser.save();
        console.log(`${newUser.name} registered successfully`);
        res.status(200).json({ status: "success", message: "Registration successful" });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ status: "failed", message: "Server error. Try again later." });
      }
})

app.get("/login",async(req,res)=> {
    const token = req.headers.authorizations.split(" ")[1];
    if(token)
        res.status(200).json({message:"/attendance",status:"success"});
    else
        res.status(200).json({message:"/login",status:"success"});
})
app.post("/login",async(req,res) => {
    
    const {email,password} = req.body;
    const mail = await User.findOne({email});
    if(!mail) return res.status(401).json({message:"Email is invalid",status:"failed"});
    const ps = await compare(password,mail.password);
    if(!ps) return res.status(401).json({message:"Password is invalid",status:"failed"});
    const token = jwt.sign(
        {id:mail.id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:60*60*1000*2
    });
    res.status(200).json({message:"User is found",status:"success",token});
})

const verifyToken = (req,res,next) =>{
    const token = req.headers.authorizations.split(" ")[1];
    if(!token || token == null) return res.status(402).json({message:"Token is invalid",status:"failed"});
    const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    req.id = user.id;
    next();
}

app.get("/logout",(req,res) => {
    const cookie = req.cookies.token;
    if(cookie){
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"none"
        });
        console.log("Logout ");
        res.status(200).json();
    }
    else{
        console.log("No token");
        res.status(402).json();
    }
})
function getWorkingDays(startMonth, startYear, endMonth, endYear) {
    const workingDays = [];
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0); // last day of endMonth

    let current = new Date(startDate);
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    while (current <= endDate) {
        const y = current.getDay(); // 0 = Sunday
        if (y !== 0) {
            console.log(y,days[y],current);
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

app.get("/attendance",verifyToken,async(req,res) => {
    const id = req.id;
    const data = await User.findOne({id});
    if(!data) return res.status(401).json({message:"User is not found",status:"failed"});
    const today = new Date();
    const filter = data.days.filter(d => new Date(d.date)<= today)
    const k = {name:data.name,email:data.email,days:filter.reverse()};
    res.status(200).json({message:"Data get successfully",status:"success",data:k});

})

app.put("/update",verifyToken,async(req,res) => {
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
    res.status(200).json({message:"Updated successfully",status:"success",data:user});
})
app.listen(PORT,() => {
    console.log("Server is listening in http://localhost:",PORT);
})
