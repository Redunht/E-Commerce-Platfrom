// client/src/CartContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // User state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch user info and cart on mount
  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // If user info is found in local storage, set it directly
          setUser(JSON.parse(storedUser));
          console.log("Loaded user from localStorage:", storedUser);

          // // Fetch user info if needed
          // const userRes = await axios.get("/api/users/protected-route", {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // });
          // setUser(userRes.data.user);

          // Fetch cart items
          const cartRes = await axios.get("/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCart(
            cartRes.data.map((item) => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.image,
            }))
          );
        } else if (token) {
          // If only the token exists, fetch the user from the backend
          const userRes = await axios.get("/api/users/protected-route", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(userRes.data.user);

          // Fetch cart items
          const cartRes = await axios.get("/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCart(
            cartRes.data.map((item) => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.image,
            }))
          );

          // Save user info to local storage
          localStorage.setItem("user", JSON.stringify(userRes.data.user));
        }
      } catch (error) {
        console.error("Error fetching user or cart:", error);
        setUser(null);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCart();
  }, []);

  // Update cart on backend whenever cart state changes
  useEffect(() => {
    const updateCartOnServer = async () => {
      if (user && !isLoading) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "/api/cart",
            {
              cart: cart.map((item) => ({
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
          console.log(response.data.msg);
        } catch (error) {
          console.error("Error updating cart on server:", error);
        }
      }
    };

    updateCartOnServer();
  }, [cart, user, isLoading]);

  return (
    <CartContext.Provider value={[cart, setCart, user, setUser, isLoading]}>
      {children}
    </CartContext.Provider>
  );
};
