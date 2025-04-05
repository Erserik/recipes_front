import React, { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Нет access-токена. Сначала авторизуйтесь.');
        return;
      }

      try {
        const response = await fetch('https://erko123.pythonanywhere.com/api/v1/auth/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          const errData = await response.json();
          const errorMessage = errData.detail || 'Ошибка при получении данных пользователя';
          setError(errorMessage);
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
      <div className="bg-white shadow-md rounded px-6 py-6 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Профиль пользователя</h2>
        <div className="space-y-2">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Имя пользователя:</strong> {user.username}</p>
          {user.bio && <p><strong>О себе:</strong> {user.bio}</p>}
          {user.avatar && (
              <div className="mt-4">
                <strong>Аватар:</strong>
                <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full mt-2 object-cover border"
                />
              </div>
          )}
        </div>
      </div>
  );
}

export default UserProfile;
