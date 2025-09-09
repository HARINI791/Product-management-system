import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-brand">
          Product Management
        </a>
        
        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {getUserInitials(user.name)}
              </div>
              <span>Welcome, {user.name}</span>
            </div>
            <button
              className="btn btn-secondary logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
