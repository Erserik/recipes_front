import React, { useEffect, useState } from 'react';
import { Card, Alert } from 'react-bootstrap';

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
      <Card className="shadow">
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="shadow">
        <Card.Body>Загрузка...</Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow">
      <Card.Body>
        <Card.Title className="mb-4">Профиль пользователя</Card.Title>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        {user.avatar && (
          <div className="my-3">
            <strong>Avatar:</strong>
            <img src={user.avatar} alt="Avatar" className="img-fluid rounded mt-2" />
          </div>
        )}
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
      </Card.Body>
    </Card>
  );
}

export default UserProfile;
