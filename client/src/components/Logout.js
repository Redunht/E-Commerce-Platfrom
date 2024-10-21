// client/src/components/Logout.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../CartContext";

const Logout = () => {
  const navigate = useNavigate();
  const [cart, setCart, user, setUser] = useContext(CartContext);

  let baseURL = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/users/logout`,
        // await axios.post(
        //   `${baseURL}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove token and user from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Set user state to null (log the user out)
      setUser(null);

      // Note: We don't clear the cart here anymore
      // The cart is persisted in the backend and will be fetched again when user logs back in

      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error Logging out:", error);
      alert("Logout failed");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
