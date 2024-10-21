// client/src/components/ProductDetails.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import "../App.css"; // Import CSS

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [cart, setCart, user, setUser, isLoading] = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  let baseURL = process.env.REACT_APP_API_URL;

  // Destructure cart and setCart from the context object
  //const { cart, setCart} = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      //.get(`${baseURL}/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id, baseURL]);

  const addToCart = async () => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let updatedCart = [];

      const existingItem = cart.find((item) => item._id === product._id);
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity }];
      }

      // Update cart on the server
      await axios.post( `/api/cart`,{
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

      // Update cart state
      setCart(updatedCart);
      navigate("/item-added", { state: { product } });
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  return (
    <div className="product-details-container">
      <Link to="/" className="home-link">
        <button className="home-button">Home Page</button>
      </Link>
      <div className="product-details">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p
            className={`stock-status ${
              product.stock === 0 ? "out-of-stock" : "in-stock"
            }`}
          >
            {product.stock > 10
              ? "In Stock"
              : product.stock > 0
              ? `${product.stock} left in stock`
              : "Out of Stock"}
          </p>
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="quantity-dropdown"
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button
              className="add-to-cart-button"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="buy-now-button"
              onClick={buyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
          <Link to="/cart" className="go-to-cart-link">
            <button className="go-to-cart-button">Go to Cart</button>
          </Link>
          <p className="product-description">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
