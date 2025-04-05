import React, { useEffect, useState, useCallback } from 'react';

const RecipeIngredients = ({ recipeId, isAuthor }) => {
    const [ingredients, setIngredients] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');

    // ✅ Правильный способ — useCallback
    const fetchIngredients = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipeId}/ingredients/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => setIngredients(data))
            .catch(() => setError('Не удалось загрузить ингредиенты'));
    }, [recipeId]);

    // ✅ useEffect с правильной зависимостью
    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Вы не авторизованы');

        const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipeId}/ingredients/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, quantity: parseFloat(quantity), unit })
        });

        if (!res.ok) {
            const data = await res.json();
            const msg = typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Ошибка';
            return setError(msg);
        }

        setName('');
        setQuantity('');
        setUnit('');
        fetchIngredients(); // Обновляем список
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const confirmed = window.confirm('Удалить ингредиент?');
        if (!confirmed) return;

        const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipeId}/ingredients/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            fetchIngredients(); // Обновляем список после удаления
        } else {
            alert('Ошибка при удалении');
        }
    };

    return (
        <div className="mt-4">
            <h4 className="font-semibold mb-2">🧂 Ингредиенты</h4>

            {ingredients.length === 0 && <p className="text-sm text-gray-500">Нет ингредиентов</p>}
            <ul className="list-disc ml-6 space-y-1">
                {ingredients.map(ing => (
                    <li key={ing.id} className="flex justify-between items-center">
                        {ing.ingredient.name} — {ing.quantity} {ing.unit}
                        {isAuthor && (
                            <button
                                onClick={() => handleDelete(ing.id)}
                                className="text-red-500 text-sm ml-2 hover:underline"
                            >
                                Удалить
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {isAuthor && (
                <form onSubmit={handleAdd} className="mt-4 space-y-2">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Название"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 w-1/3 rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Кол-во"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border p-2 w-1/3 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Ед. изм."
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="border p-2 w-1/3 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                        Добавить ингредиент
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default RecipeIngredients;
