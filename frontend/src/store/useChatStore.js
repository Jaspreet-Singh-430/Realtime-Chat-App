import {create} from "zustand"
import {toast} from "react-hot-toast"
import axiosInstance from "../lib/axios"
import { useAuthStore } from "./useAuthStore"
export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    getUsers: async () => {
        set({isUsersLoading:true})
        try{
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data.users });
        }
        catch(err){
            toast.error(err.response?.data?.message || "Error getting users");
        }
        finally{
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userid) => {
        set({isMessagesLoading:true})
        try{
            const response = await axiosInstance.get(`/messages/${userid}`);
            set({ messages: response.data.messages });
        }
        catch(err){
            toast.error(err.response?.data?.message || "Error getting messages");
        }
        finally{
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser:(user)=>{
        set({selectedUser:user})
    },
    sendMessage:async(data)=>{
        const {selectedUser,messages}=get()
        try{
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            set({messages:[...messages,res.data.newMessage]})
        }
        catch(err){
            toast.error(err.response?.data?.message || "Error sending message");
        }
    },
    subscribeToMessages:()=>{
      const {selectedUser}=get()
      if(!selectedUser){
          return;
      }  
      const socket=useAuthStore.getState().socket;
      socket.on('newMessage', (message) => {
        const isMessageSentFromSelectedUser=message.senderId==selectedUser._id
        if(message.senderId!=selectedUser._id){
            return;
        }
        set({messages:[...get().messages,message]})
      });

    },
    unsubscribeFromMessages:()=>{
        const {selectedUser}=get()
        if(!selectedUser){
            return;
        }  
        const socket=useAuthStore.getState().socket;
        socket.off('newMessage');
    }
}))