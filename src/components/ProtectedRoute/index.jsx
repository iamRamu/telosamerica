import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const token = Cookies.get("jwt_token")
    //console.log("token", token)
    const navigate = useNavigate()
    useEffect(() => {
        if(!token){
            navigate("/login")
        }
    },[token])

    return token && <Outlet/> 
}

export default ProtectedRoute
