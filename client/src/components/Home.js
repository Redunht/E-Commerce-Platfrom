// client/src/components/Home.js

import React from 'react';
import '../App.css'; // Import CSS
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    return (
        <div className="home-container">
            <Link to="/" className="home-link">
        <button className="home-button">Product List</button>
      </Link>
            <h1 className="home-heading">Welcome to the Home Page</h1>
            <p className="home-content">This is the home page content.</p>
        </div>
    );
};

export default Home;
