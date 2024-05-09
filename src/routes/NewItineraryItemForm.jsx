import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCookie } from '../cookieUtils';
import styles from '../NewTripForm.module.css'; 

const NewItineraryItemForm = ({ onSave }) => {
  const { tripId } = useParams(); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [itineraryItemData, setItineraryItemData] = useState({
    tripId: tripId,
    itineraryDate: new Date().toISOString().split('T')[0], 
    activityTime: '',
    activity: '',
    cost: 0,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItineraryItemData({ ...itineraryItemData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itineraryItemData.cost < 0 || isNaN(itineraryItemData.cost)) {
      setError('Cost cannot be a negative number.');
      return;
  }
    try {
      const token = getCookie('jwtToken'); 
      const response = await fetch('http://localhost:8080/api/itinerary-items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itineraryItemData),
      });
      if (!response.ok) {
        throw new Error('Failed to create itinerary item');
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
    navigate(-1); 
};

  return (
    <div className={styles.formContainer}>
      <h2>Create New Itinerary Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Itinerary Date:</label>
          <input
            type="date"
            name="itineraryDate"
            value={itineraryItemData.itineraryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Itinerary time:</label>
          <input
            type="time"
            name="activityTime"
            value={itineraryItemData.activityTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Itinerary description:</label>
          <input
            type="text"
            name="activity"
            value={itineraryItemData.activity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cost:</label>
          <input
            type="number"
            name="cost"
            value={itineraryItemData.cost}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={itineraryItemData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submit}>Create Itinerary Item</button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p className={styles.successMessage}>Changes saved</p>}
      <button className = {styles.backButton} onClick={handleBack}>Back</button>
    </div>
  );
};

export default NewItineraryItemForm;
