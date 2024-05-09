import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../cookieUtils';

const MyTrips = ({ onRerender } ) => {
    const handleSomeAction = () => {
        onRerender();
      };
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = getCookie('jwtToken'); 
        const response = await fetch('http://localhost:8080/api/trips/my-trips', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        console.log('Response data:', data);
        setTrips(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='myTrips'>
      <section>
        <div className="header">
          <h2>My Trips</h2>
          <Link to="/create-trip" className="active">
          <button>+ New Trip</button> 
          </Link>
        </div>
        <div className="trip-grid">
          {trips.length === 0 ? ( 
            <div className='no-trips-message'>No trips have been created.</div>
          ) : (
            trips.map((trip) => (
              <Link key={trip.id} to={`/trip-details/${trip.id}`} className="trip-item">
                <div key={trip.id} className='trip-card'>
                    <img src={trip.image} alt={trip.destination} />
                    <div className="my-trip-details">
                    <p><strong>Destination:</strong> {trip.destination}</p>
                    <p><strong>Start Date:</strong> {trip.startDate}</p>
                    <p><strong>End Date:</strong> {trip.endDate}</p>
                    </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MyTrips;

