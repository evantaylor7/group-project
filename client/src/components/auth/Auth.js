import React, { useState, useContext } from 'react';
import AuthForm from './AuthForm';
import UserContext from '../../context/userContext';

const Auth = () => {
    const initialInputs = { username: '', password: '' };

    const [inputs, setInputs] = useState(initialInputs);
    const [toggle, setToggle] = useState(false);

    const userContext = useContext(UserContext);
    const { signup, login, errMsg, resetAuthErr } = userContext;

    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        })
    )};

    const noSpaces = e => {
        e.which === 32 && e.preventDefault()
    }

    const handleSignup = e => {
        e.preventDefault();
        signup(inputs);
    };

    const handleLogin = e => {
        e.preventDefault();
        login(inputs);
    };

    const toggleForm = () => {
        setToggle(prevToggle => !prevToggle);
        resetAuthErr();
    };

    return (
        <div className='auth-page-container'>
            <div className='auth-page'>
                <h1>Photo Sharing</h1>
                { 
                toggle ?
                    <div className='auth-container'>
                        <AuthForm 
                            handleChange={ handleChange }
                            noSpaces={ noSpaces }
                            handleSubmit={ handleSignup }
                            inputs={ inputs }
                            buttonText='Create Account'
                            errMsg={ errMsg }
                        />
                        <span>Already have an account?</span>
                        <button className='button auth-toggle-button' onClick={ toggleForm }>Go to Sign in</button>
                    </div>
                :
                    <div className='auth-container'>
                        <AuthForm 
                            handleChange={ handleChange }
                            noSpaces={ noSpaces }
                            handleSubmit={ handleLogin }
                            inputs={ inputs }
                            buttonText='Login'
                            errMsg={ errMsg }
                        />
                        <span>New user?</span>
                        <button className='button auth-toggle-button' onClick={ toggleForm }>Go to Sign up</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Auth;

