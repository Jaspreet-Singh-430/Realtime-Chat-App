import React,{useState} from 'react'
import {useAuthStore} from '../store/useAuthStore'
import {Link} from "react-router-dom"
import {toast} from "react-hot-toast"
import AuthImagePattern from '../Components/AuthImagePattern'
import {MessageSquare,User,Mail,EyeOff,Eye,Lock, Loader2} from "lucide-react"
const LoginPage = () => {
  const {login,isLoggingIn} = useAuthStore()
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const [showPassword,setShowPassword]=useState(false)
  const validateForm=()=>{
  if(!formData.email.trim())
  return toast.error("Email is required")
  if(!/\S+@\S+\.\S+/.test(formData.email))
  return toast.error("Please enter a valid email")
  if(!formData.password.trim())
  return toast.error("Password is required")
  if(formData.password.length<6)
  return toast.error("Password must be at least 6 characters long")
  return true
    }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const success=validateForm()
    if(success)
    login(formData)
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-2">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center
              justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary"></MessageSquare>
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="form-control">
            <label className="label">
            <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40"></Mail>
              </div>
              <input type="text"
              className="input input-bordered w-full pl-10"
              placeholder="enter your email"
              value={formData.email} 
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
            <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40"></Lock>
              </div>
              <input type={showPassword?"text":"password"}
              className="input input-bordered w-full pl-10"
              placeholder="********"
              value={formData.password} 
              onChange={(e)=>setFormData({...formData,password:e.target.value})}
              />
              <button type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword?
                <EyeOff className="size-5 text-base-content/40"></EyeOff>:
                <Eye className="size-5 text-base-content/40"></Eye>}
              </button>
            </div>
          </div>
          <button type="submit" className={`btn btn-primary w-full`} disabled={isLoggingIn}>
          {
            isLoggingIn?(
              <>
              <Loader2 className="size-5 animate-spin"/>
              Loading...
              </>
            )
            :("Sign In")
          }
          </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">Don't have an account?{" "} 
            <Link to="/register" className="link link-primary no-underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>

     <AuthImagePattern
     title="Welcome Back!"
     subtitle="Sign in to continue your conversations and catch up with your messages"
     />     

    </div>
  )
}

export default LoginPage
