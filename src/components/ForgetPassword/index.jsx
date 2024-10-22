import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './index.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
        }),
        onSubmit: async values => {
            setApiError(null);
            try {
                const baseUrl = import.meta.env.VITE_BASE_URL;
                const apiUrl = `${baseUrl}${import.meta.env.VITE_SEND_OTP}`;

                const response = await axios.post(apiUrl, { email: values.email }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'OTP sent successfully!',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didClose: () => {
                            navigate('/verifyotp', { state: { email: values.email } });
                        }
                    });

                    formik.resetForm();
                }
            } catch (error) {
                setApiError(error.response?.data?.error || 'Failed to send OTP. Please try again.');
            }
        }
    });

    return (
        <div className='forget-password-bg-container'>
            <div className="forgetpassword-container">
                <h2 className="forgetpassword-title">Forget Password</h2>
                <p className='forgetpassword-msg'>Can't Remember? Reset Your Password Here.</p>
                <form onSubmit={formik.handleSubmit} className="forgetpassword-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error-message">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    {apiError && <div className="api-error-message">{apiError}</div>}

                    <button type="submit" className="submit-button" >
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
