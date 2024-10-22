import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const LogIn = () => {
    const [isPasswordShowed, setIsPasswordShowed] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()
    const togglePasswordType = () => {
        setIsPasswordShowed(prev => !prev)
    }
    const validationSchema = Yup.object({
        email: Yup.string().required('Email required'),
        password: Yup.string().required('Password required')
    })
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: async values => {
            console.log('login values', values)
            try {
                const baseUrl = import.meta.env.VITE_BASE_URL
                const login = import.meta.env.VITE_LOGIN
                const apiUrl = `${baseUrl}${login}`
                const response = await axios.post(apiUrl, {
                    email: values.email,
                    password: values.password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log('login response', response)
                if (response.status) {
                    //console.log("token", response.data.token)
                    Swal.fire({
                        icon : 'success',
                        title : 'User Login Successfully',
                        toast : true,
                        timer : 2000,
                        position : 'top-end',
                        showConfirmButton : false,
                        timerProgressBar : true
                    })
                    setErrorMsg('')
                    Cookies.set('jwt_token', response.data.token, { expires: 1 })
                    navigate('/')
                    Cookies.set("userEmail", values.email, {expires : 1})
                }
            } catch (error) {
                console.log('login Error', error)
                if (error.response.data) {
                    setErrorMsg(error.response.data.error)
                }
            }
        }
    })
    const token = Cookies.get('jwt_token')
    useEffect(() => {
        if (token) {
            navigate("/")
        }
    })

    const handleChange = (e) => {
        formik.handleChange(e);  
        setErrorMsg('');  
    };

    return (
        <div className='login-bg-container'>
            <form className='login-form-container' autoComplete='off' onSubmit={formik.handleSubmit}>
                <label htmlFor='email'>USER NAME</label>
                <input className='login-input' id='email' type='email' {...formik.getFieldProps('email')} onChange={handleChange} placeholder='Enter Email' />
                {formik.touched.email && formik.errors.email && (
                    <div className="error-message2">{formik.errors.email}</div>
                )}
                <label htmlFor='password'>PASSWORD</label>
                <input className='login-input' id='password' type={isPasswordShowed ? "text" : "password"} {...formik.getFieldProps('password')} onChange={handleChange}  placeholder='Enter Password' />
                {formik.touched.password && formik.errors.password && (
                    <div className="error-message2">{formik.errors.password}</div>
                )}
                <div className='login-show-password-container'>
                    <div className='checkbox-container'>
                        <input type='checkbox' id='checkbox' checked={isPasswordShowed} onChange={togglePasswordType} className='checkbox' />
                        <label htmlFor='checkbox'>Show Password</label>
                    </div>
                    <span className='forget-password' onClick={() => navigate('/forgetpassword')}>Forget Password?</span>
                </div>
                <button type='submit' className='signin-button'>Signin</button>

                {errorMsg && <div className='error-message3'>{errorMsg}</div>}
                <div style={{ marginTop: "20px", marginLeft:"-10px" }}>Don't have an account ? <span className='span-item' onClick={() => navigate('/registration')}>Register Now</span></div>
            </form>
        </div>
    )
}
export default LogIn