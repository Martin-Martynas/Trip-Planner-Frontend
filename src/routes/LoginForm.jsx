import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCookie, getCookie } from '../cookieUtils'; 
import { useAuth } from '../AuthContext'; 
import styles from '../LoginForm.module.css'; 

const LoginForm = ({  }) => { 
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message); 
      }
      const data = await response.json();

      setCookie('jwtToken', data.accessToken, 1); 
      setCookie('username', data.username, 1);
      setCookie('userId', data.id, 1);

      setFormData({ ...formData, password: '' });

      const jwtToken = getCookie('jwtToken');
      const username = getCookie('username');
      const userId = getCookie('userId');

      if (jwtToken && username && userId) {
        console.log('JWT token:', jwtToken);
        console.log('Username:', username);
        console.log('userId:', userId);

      } else {
      console.log('JWT token or username not found in cookies');
      }

      login();

       navigate('/my-trips');

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  console.log('LoginForm rendered');

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <div>Login</div>
      </div>
      <br />
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div>
           <input className={styles.inputBox} name="username" type="text" placeholder="Enter your username here"  onChange={handleChange} required /> 
        </div>
        <br />
        <div>
          <input className={styles.inputBox} name="password" type="password" placeholder="Enter your password here"  onChange={handleChange} required /> 
        </div>
        <br />
        {errorMessage && <p className={styles.errorLabel}>{errorMessage}</p>}
        <br />
        <button className={styles.inputBox} type="submit">Login</button>
        <br />
      </form>
      
      <p>Don't have an account? <Link to="/register">Create one</Link></p>
    </div>
  );
};

export default LoginForm;
