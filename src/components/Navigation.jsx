import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="main-nav">
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        Home
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        About
      </NavLink>
      <NavLink 
        to="/team" 
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        Team
      </NavLink>
    </nav>
  );
};

export default Navigation;