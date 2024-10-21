// client/src/components/ItemAdded.js

import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../CartContext";
import '../App.css'; // Import CSS

const ItemAdded = () => {
  const [cart] = useContext(CartContext);
  const location = useLocation();
  const { product } = location.state || {};

  // Dummy recommended products (you can fetch these from your backend or create a more complex logic)
  const recommendedProducts = [
    {
      id: 1,
      name: "Recommended Product 1",
      price: 30,
      image: "/images/recommended1.png",
    },
    {
      id: 2,
      name: "Recommended Product 2",
      price: 40,
      image: "/images/recommended2.png",
    },
    {
      id: 3,
      name: "Recommended Product 3",
      price: 50,
      image: "/images/recommended3.png",
    },
  ];

  return (
    <div className="item-added-container">
      <div className="item-added-box">
        <Link to="/">
          <button>Home Page</button>
        </Link>
        <h1>
          <img
            src={product?.image}
            alt={product?.name}
            style={{ width: "100px" }}
          />{" "}
          Added to Cart
        </h1>
        <div className="button-group">
          <Link to={"/checkout"}>
            <button>Proceed to Checkout({cart.length} items)</button>
          </Link>
          <Link to={"/cart"}>
            <button>Go to Cart</button>
          </Link>
        </div>
      </div>
      <div className="recommended-products-box">
        <h2>Recommended Products</h2>
        <div className="recommended-products">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="recommended-product-box">
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100px" }}
              />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemAdded;
