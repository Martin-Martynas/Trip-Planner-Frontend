import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../cookieUtils'; 


const EditProfile = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.includes('@')) {
      setError('Email must contain @ symbol.');
      return;
    }

    try {
      const loggedInUserId = getCookie('userId');

      const token = getCookie('jwtToken');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      };

      const requestBody = JSON.stringify({ email, password });

      const response = await fetch(`http://localhost:8080/api/users/${loggedInUserId}`, {
        method: 'PUT',
        headers: headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      setEmail('');
      setPassword('');

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
    }, 3000);

    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleBack = () => {
    navigate(-1); 
};

  return (
    <div className='edit-profile'>
      <h4 className='edit-profile-title'>Edit Profile</h4>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="save-changes-button">Save Changes</button>
      </form>
      <div >
      {success && <p className="success-message">Changes saved</p>} 
      {error && <p>Error: {error}</p>}
      <button className = "go-back-button" onClick={handleBack}>Back</button> 
        </div>
      
    </div>
  );
};

export default EditProfile;
