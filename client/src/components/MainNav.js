import React, { Fragment, useContext } from 'react';
import { Link } from "react-router-dom";
import globalContext from '../context/globalContext';

const MainNav = () => {
    
    const GlobalContext = useContext(globalContext);

    const logout = () => {
        GlobalContext.logout();
    }

    if (GlobalContext.isAuthenticated) 
    {      
            return (
                <Fragment>
                <nav className="main-nav">
                    <Link to="/">Expense Tracker</Link>
                </nav>
                <nav className="user-controls">
                    <Link to="/home">Home</Link>
                    <Link to="/account">Account</Link>
                    <button type="button" onClick={logout}>Logout</button>
                </nav>
            </Fragment>
            )
    }else{
            return (
                <Fragment>
                <nav className="main-nav">
                    <Link to="/">Expense Tracker</Link>
                </nav>
                <nav className="user-controls">
                    <Link to="/register">Register</Link>
                </nav>
            </Fragment>
            )
    }           
        
}

export default MainNav;
