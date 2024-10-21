// client/src/components/ShoppingCart.js

import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../CartContext";
import "../App.css"; // Import CSS
import axios from "axios";

const ShoppingCart = () => {
  const [cart, setCart, user, setUser, isLoading] = useContext(CartContext);
  const [editQuantity, setEditQuantity] = useState({});

  let baseURL = process.env.REACT_APP_API_URL;

  const getTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
    // Round to 2 decimal places
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/cart`,
        {
          // await axios.post(
          //   `${baseURL}/api/cart`,
          //   {
          cart: cart
            .filter((item) => item._id !== id)
            .map((item) => ({
              productId: item._id,
              quantity: item.quantity,
            })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      alert("Failed to remove item from cart");
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: Number(quantity) } : item
      );
      await axios.post(
        `/api/cart`,
        {
          // await axios.post(
          //   `${baseURL}/api/cart`,
          //   {
          cart: updatedCart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(updatedCart);
      setEditQuantity({ ...editQuantity, [id]: false });
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart");
    }
  };

  const handleDropdownChange = (id, value) => {
    if (value === "10+") {
      setEditQuantity({ ...editQuantity, [id]: true });
    } else {
      handleQuantityChange(id, Number(value));
    }
  };

  const handleInputChange = (id, value) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const handleUpdateClick = (id) => {
    const item = cart.find((item) => item._id === id);
    if (item.quantity < 10) {
      setEditQuantity({ ...editQuantity, [id]: false });
    }
  };

  return (
    <div className="shopping-cart-container">
      <Link to="/" className="home-link">
        <button className="home-button">Home Page</button>
      </Link>
      <h1 className="shopping-cart-heading">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="shopping-cart-list">
          {cart.map((item) => (
            <div key={item._id} className="shopping-cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h2 className="item-name">{item.name}</h2>
                <p className="item-price">
                  ${item.price} x {item.quantity}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
                {editQuantity[item._id] || item.quantity > 9 ? (
                  <>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(item._id, e.target.value)
                      }
                      className="quantity-input"
                    />
                    <button
                      className="update-button"
                      onClick={() => handleUpdateClick(item._id)}
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <select
                    value={item.quantity > 9 ? "10+" : item.quantity}
                    onChange={(e) =>
                      handleDropdownChange(item._id, e.target.value)
                    }
                    className="quantity-dropdown"
                  >
                    {[...Array(9).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                    <option value="10+">10+</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="total-amount">Total: ${getTotal()}</h2>
      <Link to="/checkout">
        <button className="checkout-button">Proceed to Checkout</button>
      </Link>
    </div>
  );
};

export default ShoppingCart;
