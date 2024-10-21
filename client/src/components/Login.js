// client/src/components/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../CartContext";
import "../App.css"; // Import CSS

const Login = () => {
  // Initialize form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  // Destructure context values
  // eslint-disable-next-line
  const [cart, setCart, user, setUser] = useContext(CartContext);
  // eslint-disable-next-line
  let baseURL = process.env.REACT_APP_API_URL;

  // Destructure form data for easier access
  const { email, password } = formData;

  // Handle input changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted with data:", formData);

    try {
      // Make POST request to login endpoint
      const res = await axios.post(`/api/users/login`, formData);
      //const res = await axios.post(`${baseURL}/api/users/login`, formData);

      console.log("Received response from login API:", res.data);

      // Destructure token and user information from response
      const { token, user: userInfo } = res.data;

      // Store token in local storage
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored successfully in localStorage:", token);
      } else {
        console.warn("No token received from login response.");
      }

      // Update user state in context
      if (userInfo) {
        setUser(userInfo);
        console.log("User state updated in context:", userInfo);
        // Store user info in local storage for persistence
        localStorage.setItem("user", JSON.stringify(userInfo));
      } else {
        console.warn("No user information received from login response.");
      }

      // Navigate to the home page
      navigate("/home");
      console.log("User logged in successfully:", res.data);
      //window.location.reload();
    } catch (error) {
      console.error("Error logging in user:", error);
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-heading">Login</h1>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
