import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../cookieUtils';
import styles from '../NewTripForm.module.css'; 
import queryString from 'query-string';

const ItineraryItemEditForm = () => {
    const [error, setError] = useState(null);
    const location = useLocation();
    const [success, setSuccess] = useState(false); 
    const { search } = location;
    const navigate = useNavigate(); 
    const { id, itineraryDate, activityTime, activity, cost, notes } = queryString.parse(search);

    const [itineraryItemData, setItineraryItemData] = useState({
        id: id || '',
        itineraryDate: itineraryDate || '',
        activityTime: activityTime || '',
        activity: activity || '',
        cost: cost || 0,
        notes: notes || '',
    });

    useEffect(() => {
        console.log("Item data in ItineraryItemEditForm:", itineraryItemData);
    }, [itineraryItemData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItineraryItemData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (itineraryItemData.cost < 0 || isNaN(itineraryItemData.cost)) {
            setError('Cost cannot be a negative number.');
            return;
        }

        try {
            const token = getCookie('jwtToken');
            const response = await fetch(`http://localhost:8080/api/itinerary-items/${itineraryItemData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(itineraryItemData),
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
        navigate(-1); 
    };

    return (
        <div className={styles.formContainer}>
            <h2>Edit Itinerary item</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Itinerary date:</label>
                    <input
                        type="text"
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
                    <input
                        type="text"
                        name="notes"
                        value={itineraryItemData.notes}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className = {styles.submit} type="submit">Save Changes</button>
            </form>
            {error && <p>Error: {error}</p>}
            {success && <p className={styles.successMessage}>Changes saved</p>} 
            <button className = {styles.backButton} onClick={handleBack}>Back</button>
        </div>
    );
};

export default ItineraryItemEditForm;
