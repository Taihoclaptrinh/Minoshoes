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
    // Login-Logup feature's temporary flow 
    // (Testing Front-end only, Need changed to appropriate form ) 
    // Type Gmail ---Continue--> Type Password
    // Forget Password  ---Continue--> Sign-Up
    return (
        <div className="login-logup">
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

            {showPassword && (
                <div class="login-container">
                    <h1>WELCOME</h1>
                    <form id="password-form">
                        <div class="input-container">
                            <input type="password" placeholder="Enter your password" required/>
                        </div>
                        <div class="forgot-password">
                            <a href="#" onClick={setShowForgotPassword}>Forgot password?</a>
                        </div>
                        <button type="submit">CONTINUE</button>
                    </form>
                </div>  
            )}

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
                        {/* To Test Sign Up, Must be changed to correct the real route  */}
                        <button type="submit" href="#" onClick={showSignUpForm} >CONTINUE</button>
                    </form>
                </div>  
            )}

            {showSignUp && (
                <div class="signup-container">
                    <h1>LET’S MAKE YOU A MINO MEMBER</h1>
                    <form id="signup-form">
                        <div class="input-container1">
                            <input type="text" id="code" placeholder="Enter the code*" required />
                        </div>
                        <div class="input-container1">
                            <input type="text" id="name" placeholder="Name" required />
                        </div>
                        <div class="input-container1">
                        <input type="date" id="dob" placeholder="Date of birth" required />
                        <input type="text" id="gender" placeholder="Gender" required />
                        </div>
                        <div class="input-container1">
                            <input type="password" id="password" placeholder="Password" required />
                        </div>
                        <div class="input-container1">
                            <input type="password" id="confirm-password" placeholder="Confirm password" required />
                        </div>
                        <div class="input-container1">
                            <input type="text" id="Address" placeholder="Address" required />
                        </div>
                        <div class="input-container1">
                            <input type="text" id="phone" placeholder="Phone Number" required />
                        </div>
                        {/* Test Sign Up  */}
                        <button type="submit"  href="#" onClick={showSignInForm}>REGISTER NOW</button>
                    </form>
                </div>  
            )}   
        </div>            
    );
}

export default LoginLogup;
