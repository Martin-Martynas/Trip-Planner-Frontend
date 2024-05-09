import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../cookieUtils';
import styles from '../NewTripForm.module.css'; 

const NewTripForm = () => {
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tripData.budget < 0 || isNaN(tripData.budget)) {
      setError('Budget cannot be negative.');
      return;
    }
    try {
      const token = getCookie('jwtToken'); 
      const response = await fetch('http://localhost:8080/api/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });
      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      navigate('/my-trips');
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2></h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            name="destination"
            value={tripData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={tripData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={tripData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={tripData.budget}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Trip</button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default NewTripForm;
