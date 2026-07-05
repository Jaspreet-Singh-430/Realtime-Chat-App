import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const register = async(req, res) => {
try {
    const { fullname, email, password } = req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    if(password.length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullname,
        email,
        password: hashedPassword
    });
    if(user){
    generateToken(user._id, res);
    await user.save();
    res.status(201).json({ message: "User created successfully",user });
    }
    else{
        res.status(400).json({ message: "Invalid user data" });
    }

    // await user.save();
} catch (error) {
    res.status(500).json({ message: error.message });
}
}
export const login = async (req, res) => {
try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({ message: "Invalid email or password" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "User logged in successfully",user });
} catch (error) {
    res.status(500).json({ message: error.message });
}
}
export const logout = async (req, res) => {
try {
    res.clearCookie("jwt") 
    res.status(200).json({ message: "User logged out successfully" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
}
export const updateProfile=async(req,res)=>{
    try{
     const {profilePicture}=req.body;
     const userId=req.user._id;
     if(!profilePicture){
        return res.status(400).json({message:"Profile picture is required"});
     }
     const result=await cloudinary.uploader.upload(profilePicture);
     const user=await User.findByIdAndUpdate(userId,{profilePicture:result.secure_url},{new:true});
     if(!user){
        return res.status(404).json({message:"User not found"});
     }
     res.status(200).json({message:"Profile picture updated successfully",user});

    }
    catch(err){
        console.log("Cloudinary error:", err);
        return res.status(500).json({message:"Failed file upload: "+err.message, error: err.http_code || err.status});
    }
}
export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json({message:"User is authenticated",user:req.user});
    }
    catch(err){
        console.log("error in checkAuth",err.message);
        return res.status(500).json({message:err.message});
    }
}