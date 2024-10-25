import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './index.css';
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null)
    const token = Cookies.get('jwt_token');
    const userEmail = Cookies.get('userEmail')
    const navigate = useNavigate()

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').optional('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain a lowercase letter')
            .matches(/[A-Z]/, 'Password must contain an uppercase letter')
            .matches(/\d/, 'Password must contain a number')
            .matches(/[@$!%*#?&]/, 'Password must contain a special character')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: userEmail,
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setError(null)
            try {
                const baseUrl = import.meta.env.VITE_BASE_URL;
                const apiUrl = `${baseUrl}${import.meta.env.VITE_CHANGE_PASSWORD}`;

                await axios.put(apiUrl, values, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Password changed successfully!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ffffff',
                    customClass: {
                        popup: 'colored-toast',
                    },
                });
                resetForm();
                navigate('/')
            } catch (error) {
                console.log('Error:', error);
                setError(error.response.data.error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error changing password!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f8d7da',
                    customClass: {
                        popup: 'colored-toast',
                    },
                });
            }
        },
    });

    const handlePassword = event => {
        setError(null)
        formik.setValues({...formik.values,
            password : event.target.value
        })
    }

    const handleConfirmPassword = event => {
        setError(null)
        formik.setValues({...formik.values,
            confirmPassword : event.target.value
        })
    }

    return (
        <div className="change-password-container">
            <h2 className="change-password-title">Change Password</h2>
            <form onSubmit={formik.handleSubmit} className="change-password-form" autoComplete="off">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email <span style={{color:"red"}}>*</span></label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input1"
                        value={userEmail}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">New Password <span style={{color:"red"}}>*</span></label>
                    <div className="password-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="form-input1"
                            {...formik.getFieldProps('password')}
                            onChange={handlePassword}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <div className="error-message">{formik.errors.password}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password <span style={{color:"red"}}>*</span></label>
                    <div className="password-container">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-input1"
                            {...formik.getFieldProps('confirmPassword')}
                            onChange={handleConfirmPassword}
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">
                            {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="error-message">{formik.errors.confirmPassword}</div>
                    )}
                </div>

                <button type="submit" className="submit-button">Change Password</button>
                {error && <div className="error-message2">{error}</div>}
            </form>
        </div>
    );
};

export default ChangePassword;
