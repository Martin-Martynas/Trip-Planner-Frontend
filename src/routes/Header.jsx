import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import Logo from '../TripPlannerLogo.svg';
import { useAuth } from '../AuthContext'; 
import { getCookie, deleteCookie } from '../cookieUtils'; 


const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    useEffect(() => {
    const jwtToken = getCookie('jwtToken'); 
    const savedUsername = getCookie('username');
    if (jwtToken && savedUsername) {
      setIsAuthenticated(true); 
      setUsername(savedUsername);
    } else {
      setIsAuthenticated(false);
      setUsername('');
    }
  }, [location.pathname]); 

      const handleLogout = () => {
      
        deleteCookie('jwtToken');
        deleteCookie('username');

        logout();

        setUsername('');
        
        setIsAuthenticated(false);
      
        navigate('/');
      };

      return (
        <header>
            <Link to={isAuthenticated ? "/my-trips" : "/"} style={{ textDecoration: 'none' }}>
          <div className="logo">
            <img src={Logo} alt="TripPlannerLogo" />
            <span>Trip Planner</span>
          </div>
          </Link>
          {isAuthenticated ? (
            <div className="log-out">
                <span className="welcomeMsg"> </span>
                <Link to="/user-profile" className="active">
                    <span className="icon-wrapper"> 
                        <FontAwesomeIcon icon={faCircleUser} className="user-icon" /> 
                    </span>
                    <span className="username link-style">{username}</span>
                </Link>
                <button className="logout" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <div className='log-in'>
                <NavLink to="/login" className="login">
                Log In
                </NavLink>
            </div>
            
          )}
        </header>
      );
    };
    
    export default Header;
