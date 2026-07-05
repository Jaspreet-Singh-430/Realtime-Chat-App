import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_MODE=="development"?"http://localhost:5001":"/";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    checkAuth: async () => {
        try{
            const response = await axiosInstance.get('/auth/check-auth');
            set({ authUser: response.data.user, isCheckingAuth: false });
            get().connectSocket();
        }
        catch(err){
            console.log("Error checking auth:", err);
            set({ authUser: null, isCheckingAuth: false });
        }
        finally{
            set({ isCheckingAuth: false });
        }
    },
    register: async (formData) => {
        set({isSigningUp:true})
        try{
            const res=await axiosInstance.post('/auth/register', formData);
            set({authUser:res.data.user})
            toast.success("Account created successfully!");
            get().connectSocket();
        }

        catch(err){
            toast.error(err.response?.data?.message || "Error signing up");
        }
        finally{
            set({ isSigningUp: false });
        }
    },
    login: async (formData) => {
        set({isLoggingIn:true})
        try{
            const res=await axiosInstance.post('/auth/login', formData);
            set({authUser:res.data.user})
            toast.success("Logged in successfully!");
            get().connectSocket();
        }
        catch(err){ 
            toast.error(err.response?.data?.message || "Error logging in");
        }
        finally{
            set({ isLoggingIn: false });
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.get('/auth/logout');
            set({authUser:null})
            toast.success("Logged out successfully!");
            get().disconnectSocket();
        }
        catch(err){
            toast.error(err.response?.data?.message || "Error logging out");
        }
},
updateProfile:async(data)=>{
set({isUpdatingProfile:true})
try{
    const res=await axiosInstance.put('/auth/update-profile', data);
    set({authUser:res.data.user})
    toast.success("Profile updated successfully!");
}
catch(err){
    console.log("Error in updating profile: "+err.message);
    toast.error(err.response?.data?.message || "Error updating profile");
}
finally{
    set({ isUpdatingProfile: false });
}
},

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser) {
            return;
        }
        if (socket?.connected) {
            return;
        }
        if (socket) {
            socket.removeAllListeners();
            socket.disconnect();
        }
        const newSocket = io(BASE_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            query: { userId: authUser._id },
        });
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);    
        });
        newSocket.on('onlineUsers', (users) => {
            set({ onlineUsers: users });
        });
        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
        set({ socket: newSocket });
    },
disconnectSocket:()=>{
if(get().socket?.connected){
    get().socket.disconnect();
}
}
}));