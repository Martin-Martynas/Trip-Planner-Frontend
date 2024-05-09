import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../RegistrationForm.module.css'; 


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      navigate("/login");
      
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <div>Registration</div>
      </div>
      <br />
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div>
          <input
            className={styles.inputBox}
            name="username"
            type="text"
            placeholder="Enter your username here"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <input
            className={styles.inputBox}
            name="email"
            type="email"
            placeholder="Enter your email here"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <input
            className={styles.inputBox}
            name="password"
            type="password"
            placeholder="Enter your password here"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        {errorMessage && (
          <p className={styles.errorLabel}>{errorMessage}</p>
        )}
        <br />
        <button className={styles.inputBox} type="submit">
          Register
        </button>
        <br />
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegistrationForm;