import { RiDashboardFill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import './index.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { store } from "../../App";
const sidebarMenu = [
    {
        path: "/",
        icon: RiDashboardFill,
        displayText: "Dashboard"
    },
    {
        path: "/courses",
        icon: FaGraduationCap,
        displayText: "Courses"
    }
]
const SideBar = props => {
    const {toggleSidebar} = props
    const { sidebarActivePath, setSidebarActivePath } = useContext(store)
    const navigate = useNavigate()
    const location = useLocation()
    //console.log(location)
    const handleSidebaritem = path => {
        // setSidebarActivePath(path)
        navigate(path)
        toggleSidebar()
    }
    useEffect(() => {
        setSidebarActivePath(location.pathname)
    },[location])
    //console.log("current path", sidebarActivePath)
    return (
        <div className="sidebar-bg-container">
            {sidebarMenu.map(each => (
                <div className={`sidebar-sub-container ${sidebarActivePath === each.path && "activepath-styling"}`} onClick={() => handleSidebaritem(each.path)} key={each.path}>
                    <each.icon className="dashboard-icon" />
                    <h3 className="text">{each.displayText}</h3>
                </div>
            ))}

        </div>
    )
}
export default SideBar