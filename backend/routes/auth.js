import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router();
const SECRET = "attendance_secret_key"

router.post("/signup",async (req,res)=>{
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,        
      username,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login",async(req,res) =>{
    try{
    const {username,password}=req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({message:`user with username ${username} not found`})
    }
    const ismatch = await bcrypt.compare(password,user.password);
    if (!ismatch){
        return res.status(400).json({message:"invalid cerdentials"});
    }
    const token = jwt.sign(
        {id:user._id},
        SECRET,
        {expiresIn :"1d"}
    );
    res.status(200).json({token});
}catch(err){
        res.status(500).json({message:"something went wrong"});
}});

export default router;