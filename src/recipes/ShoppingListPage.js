import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShoppingListPage = () => {
    const { recipeId } = useParams();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('accessToken');

    const fetchList = async () => {
        try {
            const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/shopping-list/items/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            const filtered = data.filter(item => item.recipe === parseInt(recipeId));
            setItems(filtered);
        } catch (err) {
            setError('Ошибка загрузки списка');
        }
    };

    const togglePurchased = async (itemId, currentStatus) => {
        try {
            const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/shopping-list/items/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_purchased: !currentStatus })
            });

            if (res.ok) {
                fetchList();
            } else {
                setError('Ошибка обновления статуса');
            }
        } catch (err) {
            setError('Ошибка при соединении');
        }
    };

    useEffect(() => {
        fetchList();
    }, [recipeId]);

    return (
        <div className="max-w-2xl mx-auto p-4 mt-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">🛒 Список покупок для рецепта #{recipeId}</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {items.length === 0 ? (
                <p className="text-gray-500">Нет ингредиентов</p>
            ) : (
                <ul className="space-y-3">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className="p-3 border rounded flex justify-between items-center"
                        >
                            <div>
                                {item.ingredient} — {item.quantity} {item.unit}
                                {item.is_purchased && (
                                    <span className="text-green-500 ml-2">(Куплено)</span>
                                )}
                            </div>
                            <button
                                onClick={() => togglePurchased(item.id, item.is_purchased)}
                                className={`px-3 py-1 text-sm rounded ${
                                    item.is_purchased
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                            >
                                {item.is_purchased ? 'Отметить как не куплено' : 'Отметить как куплено'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingListPage;
