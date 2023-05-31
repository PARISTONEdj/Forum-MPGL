import React from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/nav.css";

const Navigation = () => {
    return (
        <div className='navigat'>


<header>
      <nav class = "navbar">
        <div class = "container">
          <a href = "index.html" class = "navbar-brand">Forum.MPGL</a>
          <div class = "navbar-nav">
            <a href = "/home">home</a>
            <a href = "/publish">neveau Post</a>
            <a href = "/mespub">Mes publications</a>
            <a href = "/profile">Profile</a>
            <a href = "/liste">Utilisateur</a>
            <a href = "/">Deconnexion</a>
          </div>
        </div>
      </nav>
      <div class = "banner">
        <div class = "container">
          <h1 class = "banner-title">
            <span>Blog.</span> Et Discution
          </h1>
          <p>Tout le monde a le droit de s exprimer</p>
          <form>
            <input type = "text" class = "search-input" placeholder="trouver votre publication . . ."/>
            <button type = "submit" class = "search-btn">
              <i class = "fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </header>
            


        </div>
    );
};

export default Navigation;