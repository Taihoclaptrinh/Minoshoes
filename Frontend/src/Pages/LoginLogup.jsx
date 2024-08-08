import React, { useState, useContext } from "react";
import "./CSS/LoginLogup.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext.js'; // Ensure correct path

const LoginLogup = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
    const { login } = useContext(UserContext); // Get login function from UserContext

    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/v1/auth/check-email', { email });
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

        if (verificationCode !== providedCode) {
            setError('Verification code is incorrect.');
            return;
        }

        if (!name || !phone || !address || !password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await axios.post('/api/v1/auth/register', {
                name,
                phone,
                address,
                password,
                email,
                verificationCode
            });

            if (response.data.success) {
                setSuccess('Registration successful! You can now sign in.');
                setShowSignIn(true);
                setShowSignUp(false);
            } else {
                setError(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error registering:', error);
            setError(error.response?.data?.message || 'An error occurred while registering. Please try again later.');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });
            if (response.data.success) {
                const user = response.data.user;
                localStorage.setItem('token', response.data.token);
                login(user);
                alert('Login successful!');
                navigate('/');
            } else {
                setError('Login failed. Please check your email and password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in.');
        }
    };

    const handleSendResetCode = async () => {
        setError('');
        setSuccess('');
    
        if (!email) {
            setError('Email is required.');
            return false; // Indicate failure
        }
    
        try {
            const response = await axios.post('/api/v1/auth/send-reset-code', { email });
    
            if (response.data.success) {
                const token = response.data.resetToken;
                localStorage.setItem('resetToken', token);
                setSuccess('Reset code sent to email.');
                return true; // Indicate success
            } else {
                setError(response.data.message || 'Failed to send reset code. Please try again.');
                return false; // Indicate failure
            }
        } catch (error) {
            setError('An error occurred while sending the reset code. Please try again later.');
            console.error('Error sending reset code:', error);
            return false; // Indicate failure
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        const resetToken = localStorage.getItem('resetToken');
    
        if (!providedCode || !password) {
            setError('Verification code and new password are required.');
            return;
        }
    
        try {
            const response = await axios.post('/api/v1/auth/reset-password', {
                email,
                resetCode: providedCode, 
                newPassword: password,
                resetToken
            });
    
            if (response.data.success) {
                setSuccess('Password reset successful! You can now sign in with your new password.');
                setShowSignIn(true);
                setShowForgotPassword(false);
            } else {
                setError(response.data.message || 'Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError(error.response?.data?.message || 'An error occurred while resetting password. Please try again later.');
        }
    };

    const showForgotPasswordForm = async () => {
        setShowForgotPassword(true);
        setShowSignIn(false);
        setShowPassword(false);
        
        // Send the reset code immediately after showing the forgot password form
        const success = await handleSendResetCode();
        if (!success) {
            setError('Please try again.');
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
                                onChange={handleEmailChange}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" style={{ marginTop: "4rem" }}>CONTINUE</button>
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
                            <a type="button" onClick={showForgotPasswordForm}>Forgot password?</a>
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>
            )}

            {showForgotPassword && (
                <div className="login-container">
                    <h1>VERIFICATION</h1>
                    <p>Verify your email and enter a new password</p>
                    <form id="verification-form" onSubmit={handleForgotPasswordSubmit}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Verification Code*"
                                required
                                value={providedCode}
                                onChange={(e) => setProvidedCode(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <input style={{ marginBottom: "1rem" }}
                                type="password"
                                placeholder="New Password*"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit">CONFIRM</button>
                    </form>
                </div>
            )}

            {showSignUp && (
                <div className="signup-container">
                    <h1>LET’S MAKE YOU A MEMBER</h1>
                    <form id="signup-form" onSubmit={handleSignUpSubmit}>
                        <div className="signup-input-container">
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="signup-input-container">
                            <input
                                type="text"
                                placeholder="Phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="signup-input-container">
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="signup-input-container">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="signup-input-container">
                            <input
                                type="text"
                                placeholder="Verification Code"
                                required
                                value={providedCode}
                                onChange={(e) => setProvidedCode(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button type="submit">REGISTER</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginLogup;
