import React from 'react';
import { NavLink } from 'react-router-dom';

const activeStyle = { color: 'rgb(116, 154, 177)', fontWeight: 'bold' };

const Navtab = props => {
    const {to, label} = props

    return(
        <NavLink 
            className='nav-link'
            activeStyle={ activeStyle } 
            to={to}
        >
            { label }
        </NavLink>
    )
}

export default Navtab;
