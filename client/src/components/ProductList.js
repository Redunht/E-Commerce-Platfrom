// client/src/components/ProductList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../App.css'; // Import CSS

const ProductList = () => {
  const [products, setProducts] = useState([]);
  let baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      //.get(`${baseURL}/api/products/`)
      .get(`/api/products/`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [baseURL]);

  return (
    <div className="product-list-container">
      <h1 className="product-list-heading">Product List</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
