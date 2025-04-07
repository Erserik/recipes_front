// src/recipes/ShoppingListPage.js
import React, { useEffect, useState } from 'react';

const ShoppingListPage = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    const headers = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    };

    const fetchItems = async () => {
        setError('');
        try {
            const res = await fetch('https://erko123.pythonanywhere.com/api/v1/shopping-list/items/', { headers });
            const data = await res.json();

            const list = Array.isArray(data.results) ? data.results : [];
            setItems(list);
        } catch (e) {
            console.error(e);
            setError('Ошибка при загрузке списка покупок');
        }
    };

    const handlePurchase = async (id) => {
        try {
            const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/shopping-list/items/${id}/`, {
                method: 'PATCH',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_purchased: true })
            });
            if (res.ok) fetchItems();
        } catch (e) {
            console.error('Ошибка при обновлении элемента');
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const groupedByRecipe = items.reduce((acc, item) => {
        const title = item.recipe_title || 'Без рецепта';
        if (!acc[title]) acc[title] = [];
        acc[title].push(item);
        return acc;
    }, {});

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-xl font-semibold mb-4">🛒 Список покупок</h2>
            {error && <p className="text-red-500">{error}</p>}
            {!error && items.length === 0 && <p>Список пуст.</p>}

            {Object.entries(groupedByRecipe).map(([recipeTitle, recipeItems]) => (
                <div key={recipeTitle} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">🍽 {recipeTitle}</h3>
                    {recipeItems.map(item => (
                        <div key={item.id} className="p-4 border rounded mb-2 bg-white flex justify-between items-center">
                            <div>
                                <p><strong>Ингредиент:</strong> {item.ingredient_name || 'Неизвестный'}</p>
                                <p><strong>Количество:</strong> {item.quantity} {item.unit}</p>
                            </div>
                            {!item.is_purchased && (
                                <button
                                    onClick={() => handlePurchase(item.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Купить
                                </button>
                            )}
                            {item.is_purchased && (
                                <span className="text-green-600 font-semibold">✅ Куплено</span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ShoppingListPage;
