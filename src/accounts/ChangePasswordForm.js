import React, { useState } from 'react';

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Нет access-токена. Сначала авторизуйтесь.');
      return;
    }

    try {
      const response = await fetch('https://erko123.pythonanywhere.com/api/v1/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        const errorMessage = typeof errData === 'object'
            ? Object.values(errData).flat().join(' ')
            : (errData.detail || 'Ошибка при смене пароля');
        setError(errorMessage);
        return;
      }

      setSuccess('Пароль успешно изменён!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Сменить пароль</h2>

        {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>
        )}
        {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Старый пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Новый пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
          </div>

          <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Сменить пароль
          </button>
        </form>
      </div>
  );
}

export default ChangePasswordForm;
