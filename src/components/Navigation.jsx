import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navigation = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="navigation-container">
      <button onClick={toggleMenu} className="burger-button">
        ☰
      </button>
      {isMenuOpen && (
        <div className="burger-menu">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink 
            to="/trending" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            Trending
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            About
          </NavLink>
          <NavLink 
            to="/team" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            Team
          </NavLink>
          <NavLink 
            to="/recommendations" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            Recommendations
          </NavLink>
          {isAuthenticated && (
            <NavLink 
              to="/mymovies" 
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={toggleMenu}
            >
              My Movies
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;
