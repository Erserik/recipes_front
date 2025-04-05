import React, { useState } from 'react';

const RecipeForm = ({ onCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('accessToken');
        if (!token) return setError('Не авторизованы');

        const res = await fetch('https://erko123.pythonanywhere.com/api/v1/recipes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, is_public: isPublic })
        });

        if (!res.ok) {
            const errData = await res.json();
            const msg = typeof errData === 'object' ? Object.values(errData).flat().join(' ') : 'Ошибка';
            return setError(msg);
        }

        setTitle('');
        setDescription('');
        setIsPublic(true);
        onCreated(); // обновить список
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h3>➕ Добавить рецепт</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <textarea
                    placeholder="Описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={e => setIsPublic(e.target.checked)}
                    /> Публичный
                </label>
                <br />
                <button
                    type="submit"
                    style={{ padding: '10px', background: '#28a745', color: '#fff', marginTop: '10px' }}
                >
                    Создать
                </button>
            </form>
        </div>
    );
};

export default RecipeForm;
