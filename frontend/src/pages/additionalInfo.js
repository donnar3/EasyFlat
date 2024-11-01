import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdditionalSignup = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    apartmentNumber: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/signupAuth', {
          withCredentials: true,
        });
        const { imeKorisnika, prezimeKorisnika, email } = response.data.user;
        setFormData({
          firstName: imeKorisnika || '',
          lastName: prezimeKorisnika || '',
          email: email || '',
          apartmentNumber: ''
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/signupAuth/additional-signup', formData, {
        withCredentials: true
      });
      
      await axios.post('http://localhost:4000/logout', {}, {
        withCredentials: true
      });

      // Inform the user
      alert("Your data has been sent for review."); 

      navigate('/home');
    } catch (error) {
      console.error("Error during additional signup:", error);
    }
  };

  return (
    <div>
      <h2>Complete Your Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Apartment Number:</label>
          <input type="text" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} required />
        </div>
        <button type="submit">Complete Signup</button>
      </form>
    </div>
  );
};

export default AdditionalSignup;
