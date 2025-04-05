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
    <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email" 
            placeholder="Введите email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Имя пользователя</label>
          <input 
            type="text" 
            placeholder="Введите имя пользователя" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Пароль</label>
          <input 
            type="password" 
            placeholder="Введите пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Avatar (опционально)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">О себе (опционально)</label>
          <textarea 
            placeholder="Расскажите о себе" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
