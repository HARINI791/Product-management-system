import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-content">
          <div className="auth-logo">
            <h1>Product Management</h1>
            <p>Manage your products with ease</p>
          </div>
          
          {isLogin ? (
            <Login onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
