import React from 'react';

const AuthForm = props => {
    const {
        handleChange,
        noSpaces,
        handleSubmit,
        buttonText,
        errMsg,
        inputs: {
            username,
            password
        }
    } = props;
    
    return (
        <form className='auth-form' onSubmit={ handleSubmit }>
            <input 
                type='text'
                name='username'
                value={ username }
                onChange={ handleChange }
                onKeyDown={ noSpaces }
                placeholder='Username'
                maxLength={15}
                autoFocus
            />
            <input
                type='password'
                name='password'
                value={ password }
                onChange={ handleChange }
                placeholder='Password'
                maxLength={20}
            />
            <button className='button auth-button'>{ buttonText }</button>
            { errMsg && <p style={{ color: 'red' }}>{ errMsg }</p> }
        </form>
    );
};

export default AuthForm;