import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCookie } from '../cookieUtils';
import styles from '../NewTripForm.module.css';

const TripEditForm = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const [tripData, setTripData] = useState({
        destination: queryParams.get('destination') || '',
        startDate: queryParams.get('startDate') || '',
        endDate: queryParams.get('endDate') || '',
        budget: queryParams.get('budget') || 0,
    });

   const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData(prevTripData => ({ ...prevTripData, [name]: value }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tripData.budget < 0 || isNaN(tripData.budget)) {
            setError('Budget cannot be negative.');
            return;
          }
        try {
            const token = getCookie('jwtToken');
            const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tripData),
            });
            if (!response.ok) {
                throw new Error('Failed to update trip');
            }
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            
        } catch (error) {
            setError(error.message);
        }
    };
    
    const handleBack = () => {
        navigate(-2); 
    };

    return (
        <div className={styles.formContainer}>
            <h2>Edit Trip</h2>
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
                <button type="submit" className={styles.submit}>Save Changes</button>
            </form>
            {error && <p>Error: {error}</p>}
            {success && <p className={styles.successMessage}>Changes saved</p>} 
      <button className = {styles.backButton} onClick={handleBack}>Back</button>
        </div>
    );
};

export default TripEditForm;
