import React, { useState, useEffect } from 'react';
import RegisterForm from './accounts/RegisterForm';
import LoginForm from './accounts/LoginForm';
import UserProfile from './accounts/UserProfile';
import ChangePasswordForm from './accounts/ChangePasswordForm';
import HomePage from './pages/HomePage';

function App() {
  // Возможные виды: 'home', 'register', 'login', 'profile', 'changePassword'
  const [view, setView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setView('login');
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      switch (view) {
        case 'register':
          return <RegisterForm />;
        case 'login':
          return <LoginForm onLogin={handleLoginSuccess} />;
        case 'home':
        default:
          return <HomePage />;
      }
    } else {
      switch (view) {
        case 'profile':
          return <UserProfile />;
        case 'changePassword':
          return <ChangePasswordForm />;
        case 'home':
        default:
          return <HomePage />;
      }
    }
  };

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Навигация */}
        <nav className="bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                    onClick={() => setView('home')}
                    className="text-white font-bold text-xl"
                >
                  My Recipes App
                </button>
              </div>
              <div className="flex space-x-4">
                {!isAuthenticated && (
                    <>
                      <button
                          onClick={() => setView('register')}
                          className="text-gray-300 hover:text-white"
                      >
                        Регистрация
                      </button>
                      <button
                          onClick={() => setView('login')}
                          className="text-gray-300 hover:text-white"
                      >
                        Вход
                      </button>
                    </>
                )}
                {isAuthenticated && (
                    <>
                      <button
                          onClick={() => setView('home')}
                          className="text-gray-300 hover:text-white"
                      >
                        Главная
                      </button>
                      <button
                          onClick={() => setView('profile')}
                          className="text-gray-300 hover:text-white"
                      >
                        Профиль
                      </button>
                      <button
                          onClick={() => setView('changePassword')}
                          className="text-gray-300 hover:text-white"
                      >
                        Сменить пароль
                      </button>
                      <button
                          onClick={handleLogout}
                          className="text-gray-300 hover:text-white"
                      >
                        Выход
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="max-w-4xl mx-auto p-4">
          {renderContent()}
        </main>
      </div>
  );
}

export default App;
