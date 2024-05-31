import React, { useState } from "react";
import "./CSS/LoginLogup.css";

const LoginLogup = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const showSignInForm = () => {
        setShowSignIn(true);
        setShowSignUp(false);
        setShowForgotPassword(false);
    };

    const showSignUpForm = () => {
        setShowSignIn(false);
        setShowSignUp(true);
        setShowForgotPassword(false);
    };

    const showForgotPasswordForm = () => {
        setShowSignIn(false);
        setShowSignUp(false);
        setShowForgotPassword(true);
    };

    return (
        <div className="login-logup">
            {showSignIn && (
                <div className="login-box">
                    <h2>Welcome</h2>
                    <p>Sign in to continue</p>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" />
                        <small className="forgot-password" onClick={showForgotPasswordForm}>Forgot password</small>
                    </div>
                    <button className="sign-in-btn">SIGN IN</button>
                    <div className="social-sign-in">
                        <button className="google-sign-in-btn">SIGN IN via Google</button>
                        <button className="facebook-sign-in-btn">SIGN IN via Facebook</button>
                    </div>
                    <p>New customer? <a href="#" onClick={showSignUpForm}>Register</a></p>
                </div>
            )}

            {showSignUp && (
                <div className="logup-box">
                    <h2>Register</h2>
                    <p>Sign up to continue</p>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" />
                    </div>
                    <button className="sign-up-btn">SIGN UP</button>
                    <p>Already have an account? <a href="#" onClick={showSignInForm}>Sign in</a></p>
                </div>
            )}

            {showForgotPassword && (
                <div className="forgot-password-box">
                    <h2>Forgot Password</h2>
                    <p>Enter your email to reset your password</p>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <button className="reset-password-btn">RESET PASSWORD</button>
                    <p>Remember your password? <a href="#" onClick={showSignInForm}>Sign in</a></p>
                </div>
            )}
        </div>
    );
}

export default LoginLogup;
