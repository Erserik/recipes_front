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
    <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Сменить пароль</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Старый пароль</label>
          <input 
            type="password" 
            placeholder="Введите старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Новый пароль</label>
          <input 
            type="password" 
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Сменить пароль
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
