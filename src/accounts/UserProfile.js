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
      <div className="bg-white shadow-md rounded p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white shadow-md rounded p-4">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      {user.avatar && (
        <div className="my-4">
          <strong>Avatar:</strong>
          <img src={user.avatar} alt="Avatar" className="mt-2 max-w-full rounded" />
        </div>
      )}
      {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
    </div>
  );
}

export default UserProfile;
