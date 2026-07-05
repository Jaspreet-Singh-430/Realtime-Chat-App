import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedinUserId=req.user._id;
        const users=await User.find({_id:{$ne:loggedinUserId}}).select("fullname email profilePicture");
        res.status(200).json({users});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const getMessages=async(req,res)=>{
    try{
    const {id:receiverId}=req.params;
    const senderId=req.user._id;
    const messages=await Message.find({
        $or:[
            {senderId,receiverId},
            {senderId:receiverId,receiverId:senderId}
        ]
    }).sort({createdAt:1});
    res.status(200).json({messages});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export const sendMessage=async(req,res)=>{
    try {
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        const {text,image}=req.body;
        let imageUrl=null;
        if(image){
         const result=await cloudinary.uploader.upload(image);
            imageUrl=result.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json({message:"Message sent successfully",newMessage});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}