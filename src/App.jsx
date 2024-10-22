import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogIn from './components/LogIn'
import Registration from './components/Registration'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyOtp from './components/VerifyOtp'
import NotFound from './components/NotFound'
import SetPassword from './components/SetPassword'
import Dashboard from './components/Dashboard'
import Courses from './components/Courses'
import { createContext, useState } from 'react'
import MyAccount from './components/MyAccount'
//import ChangePassword from './components/ChangePassword'
import ForgetPassword from './components/ForgetPassword'
export const store = createContext([])
const App = () => {
  const [sidebarActivePath, setSidebarActivePath] = useState(window.location.pathname)
  const [isDarkMode, setIsDarkMode] = useState(false)
  return (
    <store.Provider value={{ sidebarActivePath, setSidebarActivePath, isDarkMode, setIsDarkMode }}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LogIn />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/verifyotp' element={<VerifyOtp />} />
          <Route path='/setpassword' element={<SetPassword />} />
          <Route path='forgetpassword' element={<ForgetPassword/>}/>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='courses' element={<Courses />} />
              <Route path='myaccount' element={<MyAccount/>}/>
              {/* <Route path='changepassword' element={<ChangePassword/>}/> */}
            </Route>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </store.Provider>
  )
}
export default App



