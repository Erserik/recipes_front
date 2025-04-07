import React, { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Нет access-токена. Сначала авторизуйтесь.');
        return;
      }

      try {
        const response = await fetch('https://erko123.pythonanywhere.com/api/v1/auth/user/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          const errData = await response.json();
          setError(errData.detail || 'Ошибка при получении данных пользователя');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Ошибка соединения с сервером');
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccess('');

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setPasswordError('Нет access-токена. Сначала авторизуйтесь.');
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
        setPasswordError(errorMessage);
        return;
      }

      setSuccess('Пароль успешно изменён!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError('Ошибка соединения с сервером');
    }
  };

  if (error) {
    return (
        <div className="bg-white shadow-md rounded px-6 py-4 max-w-lg mx-auto mt-8">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="bg-white shadow-md rounded px-6 py-4 max-w-lg mx-auto mt-8 text-center">
          Загрузка...
        </div>
    );
  }

  return (
      <div className="bg-white shadow-md rounded px-6 py-8 max-w-lg mx-auto mt-8">
        <div className="text-center mb-6">
          {user.avatar && (
              <div className="flex justify-center mb-4">
                <img
                    src={`https://erko123.pythonanywhere.com${user.avatar}`}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border"
                />
              </div>
          )}
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-700 mt-1">{user.email}</p>
          {user.bio && <p className="text-gray-600 italic mt-2">{user.bio}</p>}
        </div>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold mb-4 text-center">Сменить пароль</h3>

        {passwordError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{passwordError}</div>
        )}
        {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Старый пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
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

export default UserProfile;
