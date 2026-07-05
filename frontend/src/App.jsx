import './App.css'
import {Routes,Route, Navigate} from 'react-router-dom'
import Navbar from './Components/navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import {useThemeStore} from './store/useThemeStore'
import {Loader} from 'lucide-react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
function App() {
  const {authUser,isCheckingAuth,checkAuth,onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  console.log("authUser:", authUser)
  console.log("onlineUsers:", onlineUsers)
  if(isCheckingAuth && !authUser){
    return <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"></Loader>
    </div>
  }
  return (
    <div data-theme={theme} className=''>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser?<HomePage />:<Navigate to='/login'/>}></Route>
        <Route path='/register' element={!authUser?<RegisterPage />:<Navigate to='/'/>}></Route>
        <Route path='/login' element={authUser?<Navigate to='/'/>:<LoginPage />}></Route>
        <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to='/login'/>}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
