import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://erko123.pythonanywhere.com/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        const errorMessage = errData.detail || Object.values(errData).flat().join(' ');
        setError(errorMessage || 'Ошибка авторизации');
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      if (onLogin) onLogin();
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Вход</h2>
        {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="loginEmail" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
                id="loginEmail"
                type="email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="loginPassword" className="block text-sm font-medium mb-1">
              Пароль
            </label>
            <input
                id="loginPassword"
                type="password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Войти
          </button>
        </form>
      </div>
  );
}

export default LoginForm;
