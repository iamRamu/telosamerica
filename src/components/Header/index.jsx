import { MdLightMode } from "react-icons/md";
import { IoIosMoon, IoIosArrowDropdown } from "react-icons/io"; 
import './index.css'
import { useContext, useEffect, useState } from "react";
import { store } from "../../App";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { MdAccountCircle } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
import Swal from "sweetalert2";

const Header = props => {
    const { firstname, lastname, toggleSidebar , isSidebarAvailable, profileImage} = props;
    const { isDarkMode, setIsDarkMode } = useContext(store);
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const [webPage, setWebPage] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 900) {
                setWebPage(true);
            } else {
                setWebPage(false);
            }
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); 
        };
    }, [isDarkMode, setIsDarkMode, webPage,, profileImage]);

    const handleDropdownClick = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleMyAccountClick = () => {
        navigate('/myaccount');
        setDropdownOpen(false); 
    };

    const handleLogout = () => {
        Swal.fire({
            icon : 'success',
            title : 'User Loged out Successfully',
            toast : true,
            position : 'top-end',
            showConfirmButton : false,
            timer : 2000,
            timerProgressBar : true
        })
        Cookies.remove('jwt_token')
        navigate('/login')
    }

    const handleHamburgerMenu = () => {
        toggleSidebar()
    }
    console.log('innerWidth', window.innerWidth, webPage, typeof(window.innerWidth))

    return (
        <nav className="header-navbar">
            <div className='header-img-container'>
                <img src="https://media.istockphoto.com/id/1331491686/vector/element-design.jpg?s=612x612&w=0&k=20&c=QIMRS2IPiQyyTZJR_G1JAjH_ErBBkrDPtQe2GBNgm2w=" className="header-logo" />
                {webPage ? <GiHamburgerMenu className="hamburger-icon"/> : isSidebarAvailable ? <ImCross onClick={handleHamburgerMenu} className="cancel-icon"/> : <GiHamburgerMenu className="hamburger-icon" onClick={handleHamburgerMenu}/>}

            </div>
            <div className="header-dark-light-user-container">
                <div className="header-light-dark-icon-container">
                    {isDarkMode ? <MdLightMode onClick={() => setIsDarkMode(prev => !prev)} className="light-icon" /> : <IoIosMoon onClick={() => setIsDarkMode(prev => !prev)} className="dark-icon" />}
                </div>
                <div className="header-user-container">
                    <img src={profileImage || 'https://t3.ftcdn.net/jpg/05/69/30/42/360_F_569304262_RGVohUth9wyR5Msa3CoR4XFvMYE8VG1k.jpg'} alt="profile image" className="header-profile-image"/>
                    <h3>{firstname} {lastname}</h3>
                    <IoIosArrowDropdown onClick={handleDropdownClick} className="dropdown-icon" />
                    {dropdownOpen && (
                        <div className={`dropdown-menu ${isDarkMode && `dropdown-menu-dark-light`}`}>
                            <p onClick={handleMyAccountClick}> <MdAccountCircle className="icon"/> My Account</p>
                            <p onClick={handleLogout}> <RiLogoutCircleFill className="icon"/> Logout</p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
