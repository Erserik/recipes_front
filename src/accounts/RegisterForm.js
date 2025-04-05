import React, { useState } from 'react';

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
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Регистрация</h2>

        {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>
        )}
        {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
                type="email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Имя пользователя</label>
            <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Аватар (опционально)</label>
            <input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">О себе (опционально)</label>
            <textarea
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Расскажите о себе"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
  );
}

export default RegisterForm;
