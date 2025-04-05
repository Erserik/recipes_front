import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

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
    <Card className="shadow">
      <Card.Body>
        <Card.Title className="mb-4 text-center">Сменить пароль</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="oldPassword">
            <Form.Label>Старый пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Новый пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">
            Сменить пароль
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ChangePasswordForm;
