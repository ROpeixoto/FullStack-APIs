import { useNavigate } from 'react-router-dom';

const UserStatus = ({ isAuthenticated, userName, setIsAuthenticated, setUserName }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  return (
    <div className="user-status">
      {isAuthenticated ? (
        <div className="user-profile">
          <span className="user-name">{userName}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <button onClick={handleLoginClick} className="login-button">Login</button>
      )}
    </div>
  );
};

export default UserStatus;