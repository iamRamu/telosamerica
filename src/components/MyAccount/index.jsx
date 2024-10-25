import './index.css';
import { useFormik } from 'formik';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ChangePassword from '../ChangePassword';
import ViewProfile from '../ViewProfile';
import Swal from 'sweetalert2';
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { store } from '../../App';
import { useNavigate} from 'react-router-dom';

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState('viewProfile');
    const [userProfileData, setUserProfileData] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const token = Cookies.get('jwt_token');
    
    const [defaultImage] = useState('https://t3.ftcdn.net/jpg/05/69/30/42/360_F_569304262_RGVohUth9wyR5Msa3CoR4XFvMYE8VG1k.jpg')
    const { isDarkMode, profileImage, setProfileImage, count, setCount } = useContext(store)
    const navigate = useNavigate()
    console.log("count", count)
    const [imageControls, setImageControls] = useState(false)

    const handleImageChange = event => {
        setImageControls(true)
        const file = event.target.files[0];
        setImageFile(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }

    };

    const handleUploadImage = async () => {
        if (profileImage) {
            const formData = new FormData();
            formData.append('files', imageFile);

            const baseUrl = import.meta.env.VITE_BASE_URL
            const updateProfileImage = import.meta.env.VITE_PROFILE_IMAGE
            const apiUrl = `${baseUrl}${updateProfileImage}`

            try {
                const response = await axios.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`
                    }
                })
                if(response.status){
                    console.log('profile update response', response)
                    Swal.fire({
                        icon : "success",
                        title : `${response.data.msg}`,
                        toast : true,
                        position : 'top-end',
                        timer : 2000,
                        timerProgressBar : true,
                        showConfirmButton : false
                    })
                    setCount(count+1)
                    await fetchUserData();
                    navigate('/')
                }
                setImageControls(false)
            } catch (error) {
                console.log("image upload Error", error)
            }

        }
    }

    const handleCancelButton = async () => {
        if (profileImage && profileImage !== userProfileData?.profileImage) {
            setProfileImage(userProfileData?.profileImage || null)
        } else {
            const formData = new FormData();
            formData.append('files', '');

            const baseUrl = import.meta.env.VITE_BASE_URL
            const updateProfileImage = import.meta.env.VITE_PROFILE_IMAGE
            const apiUrl = `${baseUrl}${updateProfileImage}`

            try {
                const response = await axios.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`
                    }
                })
                if(response.status){
                    Swal.fire({
                        icon : 'success',
                        title : 'Profile Image Deleted Successfully',
                        toast : true,
                        position : 'top-end',
                        showConfirmButton : false,
                        timer : 2000,
                        timerProgressBar : true

                    })
                }
                setProfileImage(null)
                const updatedUserData = { ...userProfileData, profileImage: null }
                setUserProfileData(updatedUserData)
                setImageControls(false)

            } catch (error) {
                console.log("image upload Error", error)
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            primaryAddress: '',
            secondaryAddress : '',
            city: '',
            state: '',
            zipCode: '',
            notificationFrequency: '',
            reminder: '',
            role: '',
            otherRole: '',
            profileImage: ''
        },
        onSubmit: async (values) => {
            const reminderValue = values.notificationFrequency === "Daily" 
            ? 0 
            : values.notificationFrequency === "Weekly" 
            ? 1 
            : values.notificationFrequency === "Bi-Weekly" 
            ? 2 
            : values.notificationFrequency === "Monthly" ? 3 : null; 

        const updatedValues = { ...values, reminder: reminderValue };
            Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Update Details!',
                cancelButtonText: 'No, cancel!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const baseUrl = import.meta.env.VITE_BASE_URL;
                        const apiUrl = `${baseUrl}user`;

                        const response = await axios.put(apiUrl, updatedValues, {
                            headers: {
                                Authorization: `${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        console.log("response update user", response)
                        if (response.data.status) {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'Update User Details Successfully!',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                background: '#ffffff',
                                width: '400px',
                            })
                            await fetchUserData()
                            navigate('/')
                        }
                    } catch (error) {
                        console.log('Update error:', error);
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: `${error.message}`,
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            background: '#ffffff',
                            width: '400px',
                        })
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        'Cancelled',
                        'No Changes Saved',
                        'error'
                    );
                }
            });

        },
    });


    const fetchUserData = async () => {
        try {
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const apiUrl = `${baseUrl}${import.meta.env.VITE_GET_USER}`;

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const userData = response.data;
            setUserProfileData(userData)
            setProfileImage(userData.profileImage)
            formik.setValues({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                primaryAddress: userData.primaryAddress || '',
                secondaryAddress : userData.secondaryAddress || '',
                city: userData.city || '',
                state: userData.state || '',
                zipCode: userData.zipCode || '',
                notificationFrequency: userData.reminder === 0 ? "Daily" : userData.reminder === 1 ? "Weekly" : userData.reminder === 2 ? "Bi-Weekly" : userData.reminder === 3 ? "Monthly" : null || "",
                reminder: userData.reminder || '',
                role: userData.role || '',
                otherRole: userData.otherRole || '',
                profileImage: userData.profileImage || '',
            });
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token, ]);

    const handleButton = () => {
        setActiveTab('editProfile')
    }

    return (
        <div className={isDarkMode ? `my-account-container dark-theme` : 'my-account-container'}>
            <div className="button-container">
                <button
                    className={activeTab === 'viewProfile' ? 'active-button' : 'inactive-button'}
                    onClick={() => setActiveTab('viewProfile')}
                >
                    View Profile
                </button>
                <button
                    className={activeTab === 'editProfile' ? 'active-button' : 'inactive-button'}
                    onClick={() => setActiveTab('editProfile')}
                >
                    Edit Profile
                </button>
                <button
                    className={activeTab === 'changePassword' ? 'active-button' : 'inactive-button'}
                    onClick={() => setActiveTab('changePassword')}
                >
                    Change Password
                </button>
            </div>

            {activeTab === 'viewProfile' && <ViewProfile userProfileData={userProfileData} handleButton={handleButton} />}

            {activeTab === 'editProfile' && (
                <div className={isDarkMode ? "profile-edit-section dark-theme " : "profile-edit-section"}>
                    <div className={isDarkMode ? 'profile-upload-section dark-theme' : 'profile-upload-section'}>
                        <h2 className={isDarkMode ? 'dark-theme section-title' : "section-title"}>Profile Information</h2>
                        <div className={isDarkMode ? 'image-upload-section dark-theme' : "image-upload-section"}>
                            <p className={isDarkMode ? 'image-preview-text dark-theme' : 'image-preview-text'}>Image Preview</p>
                            <div className="image-preview-container">
                                <img
                                    src={profileImage || defaultImage}
                                    alt="Profile Preview"
                                    className="profile-preview"
                                />
                                {imageControls &&
                                    <div className='image-controls-container'><FaCheck className='icons' onClick={handleUploadImage} /> <ImCross className='icons' onClick={handleCancelButton} /></div>
                                }
                            </div>
                            <input type="file" accept="image/*" className='input-file' onChange={handleImageChange} />
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="my-account-form" autoComplete="off">
                        <div className={isDarkMode ? 'row dark-theme' : "row"}>
                            <div className="form-group">
                                <label htmlFor="firstName" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>First Name <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('firstName')}
                                    placeholder='FirstName'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Last Name <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('lastName')}
                                    placeholder='LastName'
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group">
                                <label htmlFor="email" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Email <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={isDarkMode ? "disabled form-input" : "form-input "}
                                    {...formik.getFieldProps('email')}
                                    placeholder='Email'
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Phone <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('phone')}
                                    placeholder='Phone'
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="primaryAddress" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Primary Address <span style={{color:"red"}}>*</span></label>
                            <input
                                id="primaryAddress"
                                name="primaryAddress"
                                type="text"
                                className="form-input"
                                {...formik.getFieldProps('primaryAddress')}
                                placeholder='Primary Address'
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="primaryAddress" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Secondary Address</label>
                            <input
                                id="secondaryAddress"
                                name="secondaryAddress"
                                type="text"
                                className="form-input"
                                {...formik.getFieldProps('secondaryAddress')}
                                placeholder='Secondary Address'
                            />
                        </div>

                        <div className="row">
                            <div className="form-group">
                                <label htmlFor="city" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>City <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('city')}
                                    placeholder='City'
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="state" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>State <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('state')}
                                    placeholder='State'
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="zipCode" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Zip Code <span style={{color:"red"}}>*</span></label>
                                <input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    className="form-input"
                                    {...formik.getFieldProps('zipCode')}
                                    placeholder='ZipCode'
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group">
                                <label htmlFor="notificationFrequency" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Notification Frequency</label>
                                <select
                                    id="notificationFrequency"
                                    name="notificationFrequency"
                                    className="form-select dropdown-style"
                                    {...formik.getFieldProps('notificationFrequency')}
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            {/* <div className="form-group">
                                <label htmlFor="reminder" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Reminder</label>
                                <input
                                    id="reminder"
                                    name="reminder"
                                    type="number"
                                    className="form-input"
                                    {...formik.getFieldProps('reminder')}
                                    placeholder='Number'
                                />
                            </div> */}
                        </div>

                        <div className="form-group">
                            <label htmlFor="role" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Role <span style={{color:"red"}}>*</span></label>
                            <input
                                id="role"
                                name="role"
                                type="text"
                                className="form-input"
                                {...formik.getFieldProps('role')}
                                placeholder='Role'
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="otherRole" className={isDarkMode ? 'form-label dark-theme' : "form-label"}>Other Role</label>
                            <input
                                id="otherRole"
                                name="otherRole"
                                type="text"
                                className="form-input"
                                {...formik.getFieldProps('otherRole')}
                                placeholder='Other Role'
                            />
                        </div>
                        <div className='edit-profile-buttons-container'>
                            <button className='active-button check-button' type='button' onClick={()=>navigate(-1)}> <FaCircleXmark className='check-icon'/> Cancel</button>
                            <button type="submit" className="active-button check-button"> <FaCheckCircle className='check-icon'/> Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'changePassword' && <ChangePassword />}

        </div>
    );
};

export default MyAccount;
