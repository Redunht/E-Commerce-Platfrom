// client/src/components/Checkout.js
import React, { useState, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { CartContext } from "../CartContext";
import "../App.css"; // Import CSS
import axios from "axios";

const Checkout = () => {
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const [cart, setCart, user, setUser, isLoading] = useContext(CartContext);
  const navigate = useNavigate();

  let baseURL = process.env.REACT_APP_API_URL;

  // const calculateTotalAmount = () => {
  //   return cart.reduce((total, item) => Math.round(total + item.price * item.quantity, 0));
  // };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to proceed with checkout.");
        navigate("/login");
        return;
      }

      // Create a checkout session on the server
      const response = await axios.post(
        `/create-checkout-session`,
        //`${baseURL}/create-checkout-session`,
        {
          items: cart.map((item) => ({
            id: item._id,
            quantity: item.quantity,
          })),
          customer: user.id, // Pass user ID if needed
          // Optionally, pass address details here if you want to save them
          address: {
            street1,
            street2,
            city,
            state: stateValue,
            zip,
            country,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error);
      // }

      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout
      console.log(url);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="checkout-container">
      <Link to="/">
        <button>Home Page</button>
      </Link>
      <h1>Checkout</h1>
      <h2 className="total-amount">
        Total: $
        {cart
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </h2>
      <form onSubmit={handleCheckout} className="checkout-form">
        <div className="form-section">
          <label>Country/Region:</label>
          <select
            type="text"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Address line 1:</label>
          <input
            type="text"
            name="street1"
            value={street1}
            onChange={(e) => setStreet1(e.target.value)}
            required
          />
        </div>
        <div className="form-section">
          <label>Address line 2:</label>
          <input
            type="text"
            name="street2"
            value={street2}
            onChange={(e) => setStreet2(e.target.value)}
          />
        </div>
        <div className="form-section">
          <label>City:</label>

          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="form-section">
          <label>State:</label>
          <select
            name="state"
            value={stateValue}
            onChange={(e) => {
              setStateValue(e.target.value);
            }}
            required
          >
            <option value="">Select State</option>
            {State.getStatesOfCountry(country).map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-section">
          <label>Zip Code:</label>
          <input
            type="text"
            name="zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <label>Payment Details:</label>
          <CardElement />
        </div>

        <button type="submit" disabled={!stripe || !elements}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
