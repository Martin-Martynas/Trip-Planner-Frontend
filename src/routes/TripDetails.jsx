import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faSortUp, faSortDown, faPen, faTrash, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie } from '../cookieUtils';


const applyFiltersAndSorting = (items, filters, sortBy, sortOrder) => {
  let filtered = items;

  if (filters && typeof filters === 'object') {

    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
      if (filterValue) {
        filtered = filtered.filter((item) => {
          if (key === 'activity' || key === 'time' || key === 'cost') {
            const itemValue = String(item[key]).toLowerCase();
            return itemValue.includes(filterValue.toLowerCase());
          } else if (key === 'itineraryDateStart' || key === 'itineraryDateEnd') {
            return true;
          }
        });
      }
    });
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
};



const TripDetails = ({  }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ activity: '', time: '', cost: '', itineraryDateStart: null, itineraryDateEnd: null });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState(0);
  const [filteredTotalCost, setFilteredTotalCost] = useState(0)

  
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = getCookie('jwtToken');
        const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trip details');
        }
        const tripData = await response.json();
        setTrip(tripData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  useEffect(() => {
    if (trip && trip.itineraryItemDtos) {
      const total = trip.itineraryItemDtos.reduce((acc, item) => acc + item.cost, 0);
      setTotalCost(total);
    }
  }, [trip]);

  useEffect(() => {
    if (trip && trip.itineraryItemDtos) {
      const filteredItems = applyFiltersAndSorting(trip.itineraryItemDtos, filters, sortBy, sortOrder);
      const filteredTotal = filteredItems.reduce((acc, item) => acc + item.cost, 0);
      setFilteredTotalCost(filteredTotal);
    }
  }, [trip, filters, sortBy, sortOrder]);

  useEffect(() => {
    console.log("Total Cost:", totalCost);
    console.log("Budget:", trip?.budget);
  }, [totalCost, trip?.budget]);

  useEffect(() => {
    console.log("Component re-rendered");
  }, [totalCost, trip?.budget]);
  
  

  const handleEdit = () => {
    const queryParams = new URLSearchParams({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
    });
    navigate(`/edit-trip/${trip.id}?${queryParams.toString()}`);
  };

  const handleItemEdit = (itemId) => {
    const itemToEdit = trip?.itineraryItemDtos.find((item) => item.id === itemId);
  };

  const handleDelete = async () => {
    try {
        const token = getCookie('jwtToken');
        const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete trip');
        }

        navigate('/my-trips');

    } catch (error) {
        setError(error.message);
    }
};

const handleItemDelete = async (itemId) => {
    try {
        const token = getCookie('jwtToken');
        const response = await fetch(`http://localhost:8080/api/itinerary-items/${itemId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete trip');
        }

        setTrip(prevTrip => ({
            ...prevTrip,
            itineraryItemDtos: prevTrip.itineraryItemDtos.filter(item => item.id !== itemId)
        }));
    } catch (error) {
        setError(error.message);
    }
};



  const handleFilterChange = useCallback((e, key) => {
    if (key === 'itineraryDateStart' || key === 'itineraryDateEnd') {
      setFilters({ ...filters, [key]: e });
    } else {
      setFilters({ ...filters, [key]: e.target.value });
    }
  }, [filters]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  
  
  const filteredAndSortedItems = () => {
    let filtered = applyFiltersAndSorting(
      trip?.itineraryItemDtos || [],
      filters,
      sortBy,
      sortOrder
    );
  
    return filtered;
  };
  

  const sortItems = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const handleBack = () => {
    navigate(-1); 
};

  return (
    <div className="trip-details-container">
      <section>
          <div className="header">
            <div className="title-container">
            <button onClick={handleBack} className="button-back">
                <FontAwesomeIcon icon={faLeftLong} className="icon-back" />
              </button>
              <h4>{trip?.destination}</h4>
              <div className="edit-delete-icons">
                <Link
                  to={`/edit-trip/${tripId}?destination=${trip.destination}&startDate=${trip.startDate}&endDate=${trip.endDate}&budget=${trip.budget}`}
                >
                  <button onClick={handleEdit} className="button-edit">
                    <FontAwesomeIcon icon={faPen} className="icon-edit" />
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="button-delete"
                  title="Delete Trip"
                  aria-label="Delete Trip"
                >
                  <FontAwesomeIcon icon={faTrash} className="icon-delete" />
                </button>

              </div>
            </div>
            <Link to={`/create-itinerary/${tripId}`} className="active">
              <button>+ New Itinerary</button>
            </Link>
          </div>
        <div className="trip-details">
  
          <div className="trip-details-main">
            <p><strong>Start Date:</strong> {trip?.startDate}</p>
            <p><strong>End Date:</strong> {trip?.endDate}</p>
            <p><strong>Budget:</strong> {trip?.budget} Eur</p>
            <p className={trip && trip.budget && totalCost > trip.budget ? 'highlighted' : ''}><strong>Total cost:</strong> {totalCost} Eur</p>
          </div>
          
  
          <div className="filter-container">
      <div className="filter">
        <label>Activity:</label>
        <input
          type="text"
          value={filters.activity}
          onChange={(e) => handleFilterChange(e, 'activity')}
          placeholder="Filter by activity"
        />
      </div>
      <div className="filter">
        <label>Time:</label>
        <input
          type="text"
          value={filters.time}
          onChange={(e) => handleFilterChange(e, 'time')}
          placeholder="Filter by time"
        />
      </div>
      <div className="filter">
        <label>Cost:</label>
        <input
          type="text"
          value={filters.cost}
          onChange={(e) => handleFilterChange(e, 'cost')}
          placeholder="Filter by cost"
        />
      </div>
      <div className="filter">
        <label>Date Range:</label>
        <DatePicker
          selected={filters.itineraryDateStart}
          onChange={(date) => handleFilterChange(date, 'itineraryDateStart')}
          selectsStart
          startDate={filters.itineraryDateStart}
          endDate={filters.itineraryDateEnd}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={filters.itineraryDateEnd}
          onChange={(date) => handleFilterChange(date, 'itineraryDateEnd')}
          selectsEnd
          startDate={filters.itineraryDateStart}
          endDate={filters.itineraryDateEnd}
          minDate={filters.itineraryDateStart}
          placeholderText="End Date"
        />
      </div>
      </div>
  
          <table className="itinerary-table">
            <thead>
            <tr className='tableHeaders'>
              <th onClick={() => sortItems('date')}>
                  Date
                  {sortBy === 'date' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                  )}
              </th>
              <th onClick={() => sortItems('activity')}>
                  Activity
                  {sortBy === 'activity' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                  )}
              </th>
              <th onClick={() => sortItems('activityTime')}>
                  Time
                  {sortBy === 'activityTime' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                  )}
              </th>
          <th onClick={() => sortItems('cost')}>
              Cost, Eur
              {sortBy === 'cost' && (
                      <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                  )}
              </th>
              <th></th>
        </tr>
            </thead>
            <tbody>
            {filteredAndSortedItems().map((item, index) => (
      <tr key={index}>
        <td>{item.itineraryDate}</td>
        <td>{item.activity}</td>
        <td>{item.activityTime}</td>
        <td>{item.cost}</td>
        <td>
            <div>
              <Link
                to={`/itinerary-item/${item.id}?activity=${encodeURIComponent(item.activity)}&cost=${encodeURIComponent(item.cost)}&id=${encodeURIComponent(item.id)}&itineraryDate=${encodeURIComponent(item.itineraryDate)}&activityTime=${encodeURIComponent(item.activityTime)}&notes=${encodeURIComponent(item.notes)}`
                }
              >
                <button onClick={() => handleItemEdit(item.id)} className='button-edit'>
                  <FontAwesomeIcon icon={faPen} className="icon-edit" />
                </button>
              </Link>
              <button onClick={() => handleItemDelete(item.id)} className='button-delete' title="Delete Itinerary Item" aria-label="Delete Itinerary Item">
                <FontAwesomeIcon icon={faTrash} className="icon-delete" />
              </button>
            </div>
          
        </td>
      </tr>
      ))}
            </tbody>
            <tfoot>
            {!Object.values(filters).some(Boolean) && !sortBy && (
  <tr>
    <td colSpan="3">Total Cost (Before Filtering/Sorting):</td>
    <td>{totalCost}</td>
    <td></td> 
  </tr>
)}
<tr>
  <td colSpan="3">Total Cost (After Filtering/Sorting):</td>
  <td>{filteredTotalCost}</td>
  <td></td> 
</tr>

</tfoot>


          </table>
        </div>
      </section>
    </div>
  );
};

export default TripDetails;




