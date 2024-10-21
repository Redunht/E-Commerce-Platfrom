// client//src/components/Register.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../CartContext";
import "../App.css"; // Import CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [cart, setCart, user, setUser] = useContext(CartContext);

  let baseURL = process.env.REACT_APP_API_URL;

  const { name, email, password, confirmPassword, address, phone } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      //const res =  await axios.post(`${baseURL}/api/users/register`, {
      const res = await axios.post(`/api/users/register`, {
        name,
        email,
        password,
        address,
        phone,
      });
      const { token, user: userInfo } = res.data;
      localStorage.setItem("token", token);
      setUser(userInfo);
      console.log("User registered successfully:");
      navigate("/home");
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-heading">Register</h1>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
