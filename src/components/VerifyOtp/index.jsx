import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otpError, setOtpError] = useState('');
    const otpInputs = useRef([]);

    const [otp, setOtp] = useState(new Array(4).fill("")); 

    const formik = useFormik({
        
        initialValues: {
            firstDigit: '',
            secondDigit: '',
            thirdDigit: '',
            fourthDigit: '',
        },
        onSubmit: async () => {
            const otpValue = otp.join(''); 
            if (otpValue.length === 4) {
                setOtpError('');
                try {
                    const baseUrl = import.meta.env.VITE_BASE_URL;
                    const verify = import.meta.env.VITE_VERIFY_OTP;
                    const apiurl = `${baseUrl}${verify}`;
                    const { state } = location;
                    const { email } = state;

                    const response = await axios.post(apiurl, {
                        email,
                        otp: parseInt(otpValue),
                    });
                    if (response.status) {
                        navigate('/setpassword', { state: { email } });
                    }
                } catch (error) {
                    if (error.response.data) {
                        setOtpError(error.response.data.error);
                    }
                }
            } else {
                setOtpError('Please provide a 4-digit OTP');
            }
        }
    });

   
    const handleChange = (e, index) => {
        const value = e.target.value;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            otpInputs.current[index + 1].focus(); 
        }
    };

   
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && !otp[index]) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 4); 
        const pasteArray = pasteData.split('');

        if (pasteArray.length === 4) {
            setOtp(pasteArray);
            pasteArray.forEach((digit, i) => {
                otpInputs.current[i].value = digit;
            });
            otpInputs.current[3].focus();
        }
        e.preventDefault(); 
    };

    const token = Cookies.get('jwt_token');
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className="otp-bg-container">
            <h2>Enter Your 4-Digit OTP</h2>
            <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className="otp-input-container" onPaste={handlePaste}>
                    {otp.map((each, index) => (
                        <input
                            key={index}
                            ref={el => otpInputs.current[index] = el}
                            className="otp-input"
                            maxLength={1}
                            value={each}
                            onChange={e => handleChange(e, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className="verify-button-container">
                    <button className="verifyOtp-button" type="submit">Verify OTP</button>
                </div>
                {otpError && <div className="otp-error-container">{otpError}</div>}
            </form>
        </div>
    );
};

export default VerifyOtp;
