import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

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
    <Card className="shadow">
      <Card.Body>
        <Card.Title className="mb-4 text-center">Вход</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Войти
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LoginForm;
