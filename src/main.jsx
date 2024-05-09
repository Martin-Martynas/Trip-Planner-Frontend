import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from "./routes/root";
import ErrorPage from "./error-page";
import LandingPage from './routes/LandingPage';
import LoginForm from './routes/LoginForm';
import RegisterForm from './routes/RegisterForm';
import MyTrips from './routes/MyTrips';
import { AuthProvider } from './AuthContext';
import NewTripForm from './routes/NewTripForm';
import TripDetails from './routes/TripDetails';
import NewItineraryItemForm from './routes/NewItineraryItemForm';
import UserProfile from './routes/UserProfile';
import EditProfile from './routes/EditProfile';
import TripEditForm from './routes/TripEditForm';
import ItineraryItemEditForm from './routes/ItineraryItemEditForm';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <LandingPage />
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterForm />,
      },
      {
        path: "my-trips",
        element: <MyTrips />,
      },
      {
        path: "create-trip",
        element: <NewTripForm />,
      },
      {
        path: "trip-details/:tripId",
        element: <TripDetails />,
      },
      {
        path: "create-itinerary/:tripId",
        element: <NewItineraryItemForm/>,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
      {
        path: "edit-trip/:tripId",
        element: <TripEditForm />,
      },
      {
        path: "itinerary-item/:itemId",
        element: <ItineraryItemEditForm />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
</React.StrictMode>
);
