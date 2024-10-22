import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './index.css';
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';  
import 'sweetalert2/dist/sweetalert2.min.css';  

const SetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isbannerAvailable, setIsBannerAvailable] = useState(true);
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must have a lowercase letter')
            .matches(/[A-Z]/, 'Password must have an uppercase letter')
            .matches(/\d/, 'Password must have a number')
            .matches(/[@$!%*#?&]/, 'Password must have a special character')
            .required('Password is required'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmpassword: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const { state } = location;
            const { email } = state;
            try {
                const baseUrl = import.meta.env.VITE_BASE_URL;
                const setPass = import.meta.env.VITE_SET_PASSWORD;
                const apiUrl = `${baseUrl}${setPass}`;
                const response = await axios.post(apiUrl, {
                    email: email,
                    password: values.password,
                    confirmPassword: values.confirmpassword
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status) {
                    setPasswordError('');
                    Swal.fire({
                        icon: 'success',
                        title: 'Password set successfully!',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didClose: () => {
                            navigate('/login');  
                        }
                    });
                }
            } catch (error) {
                console.log('setpasserror', error);
                if (error.response && error.response.data) {
                    setPasswordError(error.response.data.error);
                }
            }
        }
    });

    const handleBannerCrossButton = () => {
        setIsBannerAvailable(false);
    };

    const handleInputChange = (e) => {
        formik.handleChange(e);
        setPasswordError('');
    };

    const token = Cookies.get('jwt_token');
    
    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token]);

    return (
        <div className='setpassword-bg-container'>
            {isbannerAvailable && (
                <div className="banner-container">
                    <div className="cross-button-container">
                        <ImCross className="cross-button" onClick={handleBannerCrossButton} />
                    </div>
                    <div>
                        <h3 style={{ textAlign: "center" }}>Password Must have an uppercase letter, lowercase letter, digit, special character, and be at least 8 characters long</h3>
                    </div>
                </div>
            )}
            <form className="setpassowrd-form-container" autoComplete="off" onSubmit={formik.handleSubmit}>
                <label htmlFor="password">Create Password</label>
                <div className="input-container">
                    <input
                        id="password"
                        type={isPasswordShowed ? "text" : "password"}
                        className="setpassword-input"
                        placeholder="Enter Password"
                        onChange={handleInputChange}
                        {...formik.getFieldProps('password')}
                    />
                    {isPasswordShowed ? (
                        <IoMdEye onClick={() => setIsPasswordShowed(!isPasswordShowed)} className="eye-icon" />
                    ) : (
                        <IoMdEyeOff onClick={() => setIsPasswordShowed(!isPasswordShowed)} className="eye-icon" />
                    )}
                </div>
                {formik.touched.password && formik.errors.password && (
                    <div className="error-message1">{formik.errors.password}</div>
                )}

                <label htmlFor="confirmpassword">Confirm Password</label>
                <div className="input-container">
                    <input
                        id="confirmpassword"
                        type={isPasswordShowed ? "text" : "password"}
                        className="setpassword-input"
                        placeholder="Enter Password"
                        onChange={handleInputChange}
                        {...formik.getFieldProps('confirmpassword')}
                    />
                    {isPasswordShowed ? (
                        <IoMdEye onClick={() => setIsPasswordShowed(!isPasswordShowed)} className="eye-icon" />
                    ) : (
                        <IoMdEyeOff onClick={() => setIsPasswordShowed(!isPasswordShowed)} className="eye-icon" />
                    )}
                </div>
                {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                    <div className="error-message1">{formik.errors.confirmpassword}</div>
                )}

                {passwordError && <div className="error-message1">{passwordError}</div>}

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default SetPassword;
