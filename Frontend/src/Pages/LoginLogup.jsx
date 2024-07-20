import React, { useState } from "react";
import "./CSS/LoginLogup.css";
import Contact_info from "../Components/Contact_info/Contact_info.jsx"
import Footer from "../Components/Footer/Footer.jsx"

const LoginLogup = () => {
    const [showSignIn, setShowSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const showSignInForm = () => {
        setShowSignIn(true);
        setShowPassword(false);
        setShowSignUp(false);
        setShowForgotPassword(false);
    };
    
    const showPasswordForm = () => {
        setShowSignIn(false);
        setShowPassword(true);
        setShowSignUp(false);
        setShowForgotPassword(false);
    };

    const showSignUpForm = () => {
        setShowSignIn(false);
        setShowPassword(false);
        setShowSignUp(true);
        setShowForgotPassword(false);
    };

    const showForgotPasswordForm = () => {
        setShowSignIn(false);
        setShowSignUp(false);
        setShowPassword(false);
        setShowForgotPassword(true);
    };

    return (
        <div className="login-logup">
            <div className="login-logup-page"> 
            {showSignIn && (
                <div class="login-container">
                    <h1>WELCOME</h1>
                    <form id="email-form">
                        <div class="input-container">
                            <input type="email" placeholder="Enter your email" required/>
                        </div>
                        <div class="forgot-password">
                            <a href="#" onClick={showForgotPasswordForm}>Forgot password?</a>
                        </div>
                        <button href="#" onClick={showPasswordForm} type="submit">CONTINUE</button>
                    </form>
                </div>  

            )}
            </div>

            <div className="login-logup-page"> 
            {showPassword && (
                <div class="login-container">
                    <h1>WELCOME</h1>
                    <form id="password-form">
                        <div class="input-container">
                            <input type="password" placeholder="Enter your password" required/>
                        </div>
                        <div class="forgot-password">
                            <a href="#" onClick={showForgotPasswordForm}>Forgot password?</a>
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>  
                )}
            </div>

            <div className="login-logup-page"> 
            {showForgotPassword && (
                <div class="login-container">
                    <h1>VERIFICATION</h1>
                    <p1>Verifiy your email and enter a new password</p1>
                    <form id="verification-form">
                        <div class="input-container">
                            <input type="text" id="code" placeholder="Enter the code*" required />
                        </div>
                        <div class="input-container">
                            <input type="password" id="new-password" placeholder="Enter your new password" required />
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>  
                )}
            </div>

            {/* {showSignUp && (
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
            )} */}

            {/* {showForgotPassword && (
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
            )} */}
        {/* <Contact_info />
        <Footer /> */}
        </div>
    );
}

export default LoginLogup;
