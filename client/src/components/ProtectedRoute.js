// client/src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CartContext } from "../CartContext";

const ProtectedRoute = ({ children }) => {
  const [cart, setCart, user, setUser, isLoading] = useContext(CartContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//     const isAuthenticated = localStorage.getItem("token"); // Assuming you store JWT in localStorage

//     return isAuthenticated ? (
//         Component 
//     ) : (
//         <Navigate to="login" />
//     );
// };

// export default ProtectedRoute;

