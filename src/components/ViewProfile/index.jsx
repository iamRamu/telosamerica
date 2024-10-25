import { useContext } from 'react'
import './index.css'
import { LineWave } from 'react-loader-spinner'
import { store } from '../../App'

const ViewProfile = props => {
    const { userProfileData, handleButton } = props
    const {isDarkMode} = useContext(store)
    return (
        <div>
            {userProfileData ?
                <div className='viewProfile-bg-container'>
                    <div className='view-profile-img-container'>
                        <h2 className='profile-img-text'>Profile Image</h2>
                        <img src={userProfileData.profileImage || 'https://t3.ftcdn.net/jpg/05/69/30/42/360_F_569304262_RGVohUth9wyR5Msa3CoR4XFvMYE8VG1k.jpg'} className='view-profile-img' />
                    </div>
                    <div className='viewProfile-user-data-container'>
                        <div className='viewProfile-user-details-container'>
                            <label>Full Name <span style={{color:"red"}}>*</span></label>
                            <input value={`${userProfileData.firstName} ${userProfileData.lastName}`} disabled className={isDarkMode ? 'view-profile-input disabled' : 'view-profile-input'} />
                        </div>
                        <div className='viewProfile-user-details-container'>
                            <label>Email <span style={{color:"red"}}>*</span></label>
                            <input value={`${userProfileData.email}`} disabled className={isDarkMode ? 'view-profile-input disabled' : 'view-profile-input'} />
                        </div>
                        <div className='viewProfile-user-details-container'>
                            <label>Phone <span style={{color:"red"}}>*</span></label>
                            <input value={`${userProfileData.phone}`} disabled className={isDarkMode ? 'view-profile-input disabled' : 'view-profile-input'} />
                        </div>
                        <div className='viewProfile-user-details-container'>
                            <label>Primary Address <span style={{color:"red"}}>*</span></label>
                            <input value={`${userProfileData ? userProfileData.primaryAddress : ''}`} disabled className={isDarkMode ? 'view-profile-input disabled' : 'view-profile-input'} />
                        </div>
                        <div className='view-profile-button-container'>
                            <button className='view-profile-edit-button' onClick={() => handleButton()}>Edit Profile</button>
                        </div>
                    </div>
                </div>
                :
                <div className='loader-container'>
                    <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="line-wave-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        firstLineColor=""
                        middleLineColor=""
                        lastLineColor=""
                    />
                </div>
            }
        </div>
    )
}
export default ViewProfile