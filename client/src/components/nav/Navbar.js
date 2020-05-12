import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import Navtab from './Navtab';
import userContext from '../../context/userContext';

const activeStyle = { color: 'rgb(116, 154, 177)', fontWeight: 'bold' };

const Navbar = props => {
    const { logout } = props;
    const {token, getCurrentProfile, currentProfile: {img}} = useContext(userContext)

    useEffect(() => {
        getCurrentProfile()
    }, [token])

    return (
        <div className='nav'>
            <div className='nav-box'>
                <div>
                    <NavLink exact to='/' className='nav-link' activeStyle={activeStyle}>
                        Home
                    </NavLink>
                    <Navtab to='/profile' label='Profile'/>
                    <Navtab to='/current-user' label='My Album'/>
                </div>
                <div className='nav-user'>
                    {
                    img && img.imgUrl && 
                        <NavLink 
                            to='/profile' 
                            className='navbar-icon-link' 
                            activeStyle={{
                                'border': 'solid rgb(116, 154, 177) 1px', 
                                'height': '26px', 
                                'width': '26px',
                                'marginRight': '9px',
                                'marginTop': '-3px',
                                'marginBottom': '-3px'
                            }}
                        >
                            <div 
                                className={'navbar-icon'} 
                                style={{'backgroundImage': `url(${img.imgUrl})`}}
                            >
                            </div>
                        </NavLink>
                    }
                    {
                    token ?
                        <p 
                            className='nav-auth' 
                            onClick={ logout }
                        >
                            Log Out
                        </p>
                    :
                        <NavLink to='/auth' className='nav-auth' activeStyle={activeStyle}>
                            Log In / Sign Up
                        </NavLink>
                    }
                    
                </div>
            </div>
        </div>
    );
};

export default Navbar;
