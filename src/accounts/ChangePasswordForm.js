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

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = typeof result === 'object'
            ? Object.values(result).flat().join(' ')
            : (result.detail || 'Ошибка при смене пароля');
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
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">🔐 Смена пароля</h3>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block font-medium">Старый пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
          </div>

          <div>
            <label className="block font-medium">Новый пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Обновить пароль
          </button>
        </form>
      </div>
  );
}

export default ChangePasswordForm;
