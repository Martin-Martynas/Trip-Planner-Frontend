import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import { getCookie } from '../cookieUtils'; 
import { useAuth } from '../AuthContext';

const UserProfile = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedInUserId = getCookie('userId');
        const token = getCookie('jwtToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        };
        const response = await fetch(`http://localhost:8080/api/users/${loggedInUserId}`, {
          headers: headers, 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
        setUser(userData);
    
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [userId]);

      const handleDelete = async () => {
        try {
          const token = getCookie('jwtToken');
          const id = getCookie('userId')
          const response = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to delete user profile');
          }
          logout();

          navigate('/');

        } catch (error) {
          console.error('Error deleting user profile:', error);
        }
      };

      const handleBack = () => {
        navigate(-1); 
    };

  return (
    <div className='user-profile'>
      {user ? (
        <div>
          <h4 className='user-profile-title'>User Profile</h4>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <div className="profile-buttons">
           <div className="button-group">
            <Link to="/edit-profile" className="edit-button">Edit Profile</Link> 
            <button className="delete-button" onClick={handleDelete}>Delete Profile</button>
          </div>
          <button className="go-back-button" onClick={handleBack}>Back</button> 
        </div>
      </div>
      ) : (
        <p className='loading-text'>Loading...</p>
      )}
    </div>
  );
  
};

export default UserProfile;
