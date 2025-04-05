import React, { useState } from 'react';

const EditRecipeModal = ({ recipe, onClose, onUpdated }) => {
    const [title, setTitle] = useState(recipe.title || '');
    const [description, setDescription] = useState(recipe.description || '');
    const [isPublic, setIsPublic] = useState(recipe.is_public || false);
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Вы не авторизованы');
            return;
        }

        try {
            const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipe.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    is_public: isPublic
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                const msg = typeof errData === 'object'
                    ? Object.values(errData).flat().join(' ')
                    : 'Ошибка при обновлении';
                return setError(msg);
            }

            onUpdated(); // обновляем список
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                <h3 className="text-lg font-bold mb-4">✏️ Редактировать рецепт</h3>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Название</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium">Описание</label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="mr-2"
                            />
                            Публичный
                        </label>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            💾 Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ❌ Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipeModal;
