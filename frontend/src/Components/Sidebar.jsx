import React,{useState,useEffect} from 'react'
import {useChatStore} from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import SidebarSkeleton from './SidebarSkeleton'
import { Users } from 'lucide-react'
const Sidebar = () => {
    const {users,getUsers,selectedUser,setSelectedUser,
        isUsersLoading
    }=useChatStore()
    const {onlineUsers}=useAuthStore()
    const [showOnlineUsers,setShowOnlineUsers]=useState(false)
    useEffect(()=>{
       getUsers() 
    },[getUsers])

    const filteredUsers=showOnlineUsers ? users.filter((user) => onlineUsers.includes(user._id)) : users
    if(isUsersLoading){
        return <SidebarSkeleton/>
    }
  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300
    flex flex-col transition-all duration-200'>
        <div className="border-b w-full border-base-300 p-5">
            <div className="flex items-center gap-2">
                <Users className='w-6 h-6'/>
                <span className='font-medium hidden lg:block'>Contacts</span>
            </div>
           <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={(e) => setShowOnlineUsers(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
        </div>
        <div className='overflow-y-auto w-full py-3'>
        {filteredUsers.map((user) => (
            <button
            key={user._id}
            onClick={()=>setSelectedUser(user)}
            className={`w-full flex items-center gap-3 p-3
            hover:bg-base-300 transition-colors
            ${selectedUser}?._id == user._id ? "bg-base-300 ring-1 ring-base-300":""}`}
            >
                <div className="relative mx-auto lg:mx-0">
                    <img
                        src={user.profilePicture || "/avatar.png"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {onlineUsers.includes(user._id) && (
                        <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500
                        rounded-full ring-2 ring-zinc-300"
                        >
                        </span>
                    )}
                </div>
                <div className="hidden text-left min-w-0 lg:block">
                    <div className="font-medium truncate">
                        {user.fullname}
                    </div>
                    <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                </div>
            </button>
        ))}
        {filteredUsers.length === 0 && (
            <div className="text-center py-4 text-zinc-400">
                No online users
            </div>
        )}
        </div>
    </aside>
  )
}

export default Sidebar
