import React, { useState } from "react";
import "./CSS/LoginLogup.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginLogup = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [providedCode, setProvidedCode] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const showForgotPasswordForm = () => {
        setShowSignIn(false);
        setShowSignUp(false);
        setShowPassword(false);
        setShowForgotPassword(true);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/check-email', { email });
            if (response.data.userExists) {
                setShowPassword(true);
                setShowSignIn(false);
            } else {
                setVerificationCode(response.data.verificationCode);
                setShowSignUp(true);
                setShowSignIn(false);
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setError('An error occurred while checking the email.');
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        // Kiểm tra mã xác thực
        if (verificationCode !== providedCode) {
            setError('Verification code is incorrect.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
                name,
                phone,
                address,
                password,
                email,
                verificationCode,
                providedCode
            });
    
            // Kiểm tra phản hồi từ máy chủ
            if (response.data.success) {
                setSuccess('Registration successful! You can now sign in.');
                setShowSignIn(true);
                setShowSignUp(false);
            } else {
                // Nếu không thành công, hiển thị thông báo lỗi từ máy chủ
                setError(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            // Nếu có lỗi xảy ra trong quá trình đăng ký
            console.error('Error registering:', error);
    
            // Kiểm tra xem có phản hồi từ máy chủ không
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred while registering. Please try again later.');
            }
        }
    };
    
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            if (response.data.success) {
                const user = response.data.user;
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Login successful!', response.data);
    
                // Redirect to homepage
                navigate('/');
            } else {
                setError('Login failed. Please check your email and password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in.');
        }
    };
    
    return (
        <div className="login-logup">
            {showSignIn && (
                <div className="login-container">
                    <h1>WELCOME</h1>
                    <form id="email-form" onSubmit={handleEmailSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="forgot-password">
                            <a type="button" onClick={() => showForgotPasswordForm(true)}>Forgot password?</a>
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>
            )}

            {showPassword && (
                <div className="login-container">
                    <h1>WELCOME</h1>
                    <form id="password-form" onSubmit={handleLoginSubmit}>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="forgot-password">
                            <a type="button" onClick={() => showForgotPasswordForm(true)}>Forgot password?</a>
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>
            )}

            {showForgotPassword && (
                <div className="login-container">
                    <h1>VERIFICATION</h1>
                    <p>Verify your email and enter a new password</p>
                    <form id="verification-form" onSubmit={handleSignUpSubmit}>
                        <div className="input-container">
                            <input
                                type="text"
                                id="code"
                                placeholder="Enter the code*"
                                required
                                value={providedCode}
                                onChange={(e) => setProvidedCode(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                id="new-password"
                                placeholder="Enter your new password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>
            )}
    
            {showSignUp && (
                <div className="signup-container">
                    <h1>LET’S MAKE YOU A MEMBER</h1>
                    <form id="signup-form" onSubmit={handleSignUpSubmit}>
                        <div className="input-container1">
                            <input
                                type="text"
                                placeholder="Verification Code"
                                required
                                value={providedCode}
                                onChange={(e) => setProvidedCode(e.target.value)}
                            />
                        </div>
                        <div className="input-container1">
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-container1">
                            <input
                                type="text"
                                placeholder="Phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="input-container1">
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="input-container1">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit">REGISTER NOW</button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default LoginLogup;
