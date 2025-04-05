import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('bio', bio);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await fetch('https://erko123.pythonanywhere.com/api/v1/auth/register/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        const errorMessage = typeof errData === 'object'
          ? Object.values(errData).flat().join(' ')
          : (errData.detail || 'Ошибка регистрации');
        setError(errorMessage);
        return;
      }

      await response.json();
      setSuccess('Регистрация успешна! Теперь вы можете войти.');
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <Card className="shadow">
      <Card.Body>
        <Card.Title className="mb-4 text-center">Регистрация</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerAvatar">
            <Form.Label>Avatar (опционально)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerBio">
            <Form.Label>О себе (опционально)</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Расскажите о себе"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">
            Зарегистрироваться
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;
