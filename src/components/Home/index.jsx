import axios from 'axios'
import Header from '../Header'
import SideBar from '../SideBar'
import Cookies from 'js-cookie'
import './index.css'
import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '../../App'

const Home = () => {
    const [userDetails, setUserDetails] = useState(null)
    const [isSidebarAvailable, setIsSidebarAvailable] = useState(false)
    const {isDarkMode, count} = useContext(store)
    const token = Cookies.get('jwt_token')


    const getUser = async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL
        const userEndPath = import.meta.env.VITE_GET_USER
        const apiUrl = `${baseUrl}${userEndPath}`
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                }
            })
            const data = response.data
            // console.log("response", response)
            // console.log("data", data)
            if (response.status) {
                setUserDetails({...data})
            }

        } catch (error) {
            console.log("api fetch error", error)
        }

    }

    useEffect(() => {
        getUser()
        const handleResize = () => {
            if(window.innerWidth >= 900){
                setIsSidebarAvailable(true)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [isSidebarAvailable, count])

    const toggleSidebar = () => {
        setIsSidebarAvailable(!isSidebarAvailable)
    }

    const darkTheme = isDarkMode ? "darkTheme" : "lightTheme"
    return (
        <div className={`home-bg-container ${darkTheme}`}>
            <div className='header-container'>
                {userDetails &&
                    <Header firstname={userDetails.firstName} lastname={userDetails.lastName} toggleSidebar={toggleSidebar} isSidebarAvailable={isSidebarAvailable} profileImage={userDetails.profileImage}/>
                }
            </div>
            <div className='home-page-sidebar-main-content-container'>
                <div className={`sidebar-container ${isSidebarAvailable && 'sidebar-active'}`}>
                    {isSidebarAvailable && <SideBar toggleSidebar={toggleSidebar}/>}  
                </div>
                <div className={isSidebarAvailable ? 'main-content-container' : 'main-content-container-full-width'}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Home