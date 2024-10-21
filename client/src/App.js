// client/src/App.js
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./stripe";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ShoppingCart from "./components/ShoppingCart";
import Checkout from "./components/Checkout";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ItemAdded from "./components/ItemAdded";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider, CartContext } from "./CartContext";
import axios from "axios";

function App() {
  console.log("Rendering App...");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [cart, setCart, user, setUser, isLoading] = useContext(CartContext); // Get user from context
  console.log("Checking app.js user: ", user);
  useEffect(() => {
    
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      console.log("Checked authentication status:", !!token); // Debugging line
    };

    // Add a listener to localStorage change
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  console.log("Is authenticated App.js:", isAuthenticated);

  return (
    <Elements stripe={stripePromise}>
      <CartProvider>
        <Router>
          <div>
            <nav>
              <a href="/home">Home</a>
              {isAuthenticated ? (
                <>
                  <span>Hello, {user?.name.split(" ")[0]|| "User"} Welcome</span>
                  <a href="/cart">Cart</a>
                  <Logout />
                </>
              ) : (
                <>
                  <a href="/login">Login</a>
                  <a href="/register">Register</a>
                </>
              )}
            </nav>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <ShoppingCart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="/item-added" element={<ItemAdded />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </Elements>
  );
}

export default App;
