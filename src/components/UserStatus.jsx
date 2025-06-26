import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const UserStatus = ({
  isAuthenticated,
  userName,
  setIsAuthenticated,
  setUserName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [burgerOpen, setBurgerOpen] = useState(false);

  const handleLoginClick = () => {
    setBurgerOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setBurgerOpen(false);
    navigate("/");
  };

  // Esconde o botão de login nas páginas de login e registro
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="user-status navigation-container">
      {isAuthenticated && userName ? (
        <div className="user-profile">
          <span className="user-name">👤 {userName}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        !isAuthPage && (
          <button onClick={handleLoginClick} className="login-button">
            Login
          </button>
        )
      )}

      {/* Botão Burger ao lado do login/logout */}
      <button
        className="burger-button"
        aria-label="Toggle menu"
        aria-expanded={burgerOpen}
        onClick={() => setBurgerOpen(!burgerOpen)}
      >
        &#9776;
      </button>

      {burgerOpen && (
        <nav className="burger-menu" role="menu">
          <Link to="/" onClick={() => setBurgerOpen(false)}>
            Home
          </Link>
          <Link to="/trending" onClick={() => setBurgerOpen(false)}>
            Trending
          </Link>
          <Link to="/about" onClick={() => setBurgerOpen(false)}>
            About
          </Link>
          <Link to="/team" onClick={() => setBurgerOpen(false)}>
            Team
          </Link>
          {isAuthenticated && (
            <Link to="/mymovies" onClick={() => setBurgerOpen(false)}>
              MyMovies
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/recommendations" onClick={() => setBurgerOpen(false)}>
              Recommendations
            </Link>
          )}
        </nav>
      )}
    </div>
  );
};

export default UserStatus;
