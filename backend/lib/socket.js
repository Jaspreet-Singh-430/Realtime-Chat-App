import {Server} from "socket.io"
import http from "http"
import express from "express"
const app=express()
const server=http.createServer(app)
const userSocketMap = {};
const io=new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
})
export function getReceiverSocketId(userId){
return userSocketMap[userId]
}
io.on('connection',(socket)=>{
    console.log("user connected "+socket.id)
    const userId=socket.handshake.query.userId;
    userSocketMap[userId]=socket.id
    io.emit('onlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        console.log("user disconnected "+socket.id)
        delete userSocketMap[userId]
        io.emit('onlineUsers',Object.keys(userSocketMap))
    })
})
export {io,server,app}