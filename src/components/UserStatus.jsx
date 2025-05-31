import { useNavigate, useLocation } from 'react-router-dom';

const UserStatus = ({ isAuthenticated, userName, setIsAuthenticated, setUserName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  // Esconde o botão de login nas páginas de login e registro
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="user-status">
      {isAuthenticated && userName ? (
        <div className="user-profile">
          <span className="user-name">👤 {userName}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        !isAuthPage && (
          <button onClick={handleLoginClick} className="login-button">Login</button>
        )
      )}
    </div>
  );
};

export default UserStatus;