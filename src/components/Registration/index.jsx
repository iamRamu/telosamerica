import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup';
import './index.css'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const Registration = () => {
    const navigate = useNavigate()
    const [mobileError, setMobileError] = useState('')
    const [emailError, setEmailError] = useState('')
    const validationSchema = Yup.object({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        mobile: Yup.string()
            .matches(/^[0-9]+$/, "Mobile number must be digits")
            .min(10, 'Mobile number must be at least 10 digits')
            .required('Mobile number is required'),
        company: Yup.string().required('Company name is required'),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Phone number must be digits")
            .min(10, 'Phone number must be at least 10 digits')
            .required('Phone number is required'),
        role: Yup.string().required('Role is required'),
        otherRole: Yup.string().optional('Other role is optional'),
    });
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            company: "",
            phone: "",
            role: "",
            otherRole: ""
        },
        validationSchema,
        onSubmit: async values => {
            console.log("values", values)
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const signup = import.meta.env.VITE_USER_SIGNUP
            console.log("signup", signup)
            const apiUrl = `${baseUrl}${signup}`
            try {
                const response = await axios.post(apiUrl, values, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status) {
                    setEmailError('')
                    setMobileError('')
                    navigate('/verifyotp', { state: { email: values.email } })
                }

                console.log("response", response.data);
            } catch (error) {
                console.log("registration error", error)
                if (error.response && error.response.data) {
                    const errorData = error.response.data;
                    if (errorData.email) {
                        setEmailError(errorData.email)
                    }
                    if (!errorData.email) {
                        setEmailError('')
                    }
                    if (errorData.mobile) {
                        setMobileError(errorData.mobile)
                    }
                    if (!errorData.mobile) {
                        setMobileError('')
                    }
                } else {
                    console.log("Error:", error.message)
                }
            }
        }

    })

    const handleEmailChange = (e) => {
        formik.handleChange(e);
        setEmailError('');
    };

    const handleMobileChange = (e) => {
        setMobileError('');
        formik.handleChange(e);
    };

    const token = Cookies.get('jwt_token')
    useEffect(() => {
        if (token) {
            navigate("/")
        }
    },[token])

    return (
        <div className='registration-bg-container'>
            <form className='registration-form' onSubmit={formik.handleSubmit} autoComplete='off'>
                <h2 className='registration-form-heading'>Registration Form</h2>
                <div className='user-full-name-container'>
                    <div className='first-name-container'>
                        <label htmlFor='firstname'>FIRST NAME</label>
                        <input className='register-input-first-name' id='firstname' name="firstName" onChange={formik.handleChange} {...formik.getFieldProps('firstName')} placeholder='First Name' />
                        {formik.touched.firstName && formik.errors.firstName ? (
                            <div className="error-message">{formik.errors.firstName}</div>
                        ) : null}
                    </div>
                    <div className='last-name-container'>
                        <label htmlFor='lastname'>LAST NAME</label>
                        <input className='register-input-last-name' id='lastname' name='lastName' onChange={formik.handleChange} {...formik.getFieldProps('lastName')} placeholder='Last Name' />
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <div className="error-message">{formik.errors.lastName}</div>
                        ) : null}
                    </div>
                </div>
                <div className='user-full-name-container'>
                    <div className='first-name-container'>
                        <label htmlFor='email'>EMAIL</label>
                        <input className='register-input-first-name' id='email' type='email' name='email'  {...formik.getFieldProps('email')} placeholder='Email' onChange={handleEmailChange} />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error-message">{formik.errors.email}</div>
                        ) : null}
                        {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                    <div className='last-name-container'>
                        <label htmlFor='mobile'>MOBILE</label>
                        <input type='text' className='register-input-last-name' id='mobile' name='mobile'  {...formik.getFieldProps('mobile')} placeholder='Mobile Number' onChange={handleMobileChange}/>
                        {formik.touched.mobile && formik.errors.mobile ? (
                            <div className="error-message">{formik.errors.mobile}</div>
                        ) : null}
                        {mobileError && <div className="error-message">{mobileError}</div>}
                    </div>
                </div>
                <label htmlFor='company'>COMPANY</label>
                <input className='register-input' id='company' name='company' onChange={formik.handleChange} {...formik.getFieldProps('company')} placeholder='Company' />
                {formik.touched.company && formik.errors.company ? (
                    <div className="error-message">{formik.errors.company}</div>
                ) : null}
                <label htmlFor='phone'>PHONE</label>
                <input className='register-input' type='text' id='phone' name='phone'  {...formik.getFieldProps('phone')} placeholder='Phone' onChange={handleMobileChange}/>
                {formik.touched.phone && formik.errors.phone ? (
                    <div className="error-message">{formik.errors.phone}</div>
                ) : null}
                {mobileError && <div className="error-message">{mobileError}</div>}
                <div className='user-full-name-container'>
                    <div className='first-name-container'>
                        <label htmlFor='role'>ROLE</label>
                        <input className='register-input-first-name' id='role' name='role' onChange={formik.handleChange} {...formik.getFieldProps('role')} placeholder='Role' />
                        {formik.touched.role && formik.errors.role ? (
                            <div className="error-message">{formik.errors.role}</div>
                        ) : null}
                    </div>
                    <div className='last-name-container'>
                        <label htmlFor='otherrole'>OTHER ROLE</label>
                        <input className='register-input-last-name' type='text' id='otherrole' name='otherRole' onChange={formik.handleChange} {...formik.getFieldProps('otherRole')} placeholder='Other Role Optional' />
                        {formik.touched.otherRole && formik.errors.otherRole ? (
                            <div className="error-message">{formik.errors.otherRole}</div>
                        ) : null}
                    </div>
                </div>
                <button type='submit' className='signup-button'>SignUp</button>
                <div className='sigin-container'>Already have an account ? <span className='span-item' onClick={() => navigate('/login')}>Signin</span></div>
            </form>
        </div>
    )
}

export default Registration