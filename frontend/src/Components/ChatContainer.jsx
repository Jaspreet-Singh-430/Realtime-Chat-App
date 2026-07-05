import React,{useEffect,useRef} from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatComponents/ChatHeader'
import MessageSkeleton from './MessageSkeleton'
import MessageInput from './ChatComponents/MessageInput'
import { formatMessageTime } from '../lib/utils'
const ChatContainer = () => {
    const {authUser}=useAuthStore()
    const messageEndRef=useRef(null)
    const {selectedUser,messages,getMessages,isMessagesLoading,
        subscribeToMessages,unsubscribeFromMessages
    }=useChatStore()
    useEffect(()=>{
        getMessages(selectedUser._id)
        subscribeToMessages();
        return()=>{
            unsubscribeFromMessages();
        }
    },[getMessages,selectedUser._id,subscribeToMessages,unsubscribeFromMessages])

    useEffect(()=>{
        if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[messages])
    if(isMessagesLoading){
     return <div className='flex flex-col flex-1 overflow-auto'>
        <ChatHeader></ChatHeader>
        <MessageSkeleton></MessageSkeleton>
        <MessageInput></MessageInput>
        </div>
    }
  return (
    <div className='flex flex-col flex-1 overflow-auto'>
      <ChatHeader></ChatHeader>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message)=>(
            <div
            key={message._id}
            className={`chat ${message?.senderId==authUser._id?"chat-end":"chat-start"}`}
            ref={messageEndRef}
            >
                <div className='chat-image avatar'>
                    <div className="size-10 rounded-full border">
                        <img src={message.senderId==authUser._id?authUser.profilePicture || "/avatar.png":selectedUser.profilePicture||"/avatar.png"} 
                        alt="profile picture" />
                    </div>
                </div>
                <div className='chat-header mb-1'>
                <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                </time>
                </div>
                <div className='chat-bubble flex flex-col'>
                {message.image && (
                    <img 
                    src={message.image} 
                    alt="chat image"
                    className='sm:max-w-[200px] rounded-md mb-2' 
                    />
                )}
                {message.text && <p>{message.text}</p>}
                </div>
            </div>
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  )
}

export default ChatContainer
