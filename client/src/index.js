import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from './context/UserProvider';
import ScrollToTop from './ScrollToTop.js'

import './css/styles.css';
import App from './App';

const rootElement = document.getElementById('root');

render ( 
    <Router>
        <ScrollToTop/>
        <UserProvider>
            <App />
        </UserProvider>
    </Router>,
    rootElement 
)