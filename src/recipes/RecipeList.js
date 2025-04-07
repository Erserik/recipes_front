import React, { useEffect, useState } from 'react';
import EditRecipeModal from './EditRecipeModal';
import CommentSection from './CommentSection';
import RecipeIngredients from './RecipeIngredients';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');
    const [editingRecipe, setEditingRecipe] = useState(null);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) return;

        fetch('https://erko123.pythonanywhere.com/api/v1/auth/user/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .catch(() => {
                setError('Ошибка при получении пользователя');
                setCurrentUser(null);
            });
    }, [token]);

    const fetchRecipes = () => {
        fetch('https://erko123.pythonanywhere.com/api/v1/recipes/')
            .then(res => res.json())
            .then(data => setRecipes(data.results || []))
            .catch(() => setError('Не удалось загрузить рецепты'));
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        if (!token) return alert('Вы не авторизованы');

        const confirmed = window.confirm('Вы уверены, что хотите удалить рецепт?');
        if (!confirmed) return;

        const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setRecipes(prev => prev.filter(r => r.id !== id));
        } else {
            alert('Ошибка при удалении');
        }
    };

    const handleBuyIngredients = async (recipeId, ingredients) => {
        if (!token || !currentUser?.id) return alert('Нет данных о пользователе');

        const shoppingListId = currentUser.id; // 👈 Используем user.id как shopping_list_id

        try {
            for (const ing of ingredients) {
                await fetch('https://erko123.pythonanywhere.com/api/v1/shopping-list/items/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        shopping_list_id: shoppingListId,
                        ingredient_id: ing.ingredient.id,
                        recipe_id: recipeId,
                        quantity: ing.quantity,
                        unit: ing.unit
                    })
                });
            }

            alert('Ингредиенты добавлены в список покупок!');
        } catch (err) {
            console.error(err);
            alert('Ошибка при добавлении ингредиентов');
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-xl font-semibold mb-4">📋 Рецепты</h2>

            {!currentUser ? (
                <p className="text-gray-600">Чтобы просматривать рецепты, пожалуйста, авторизуйтесь.</p>
            ) : (
                <>
                    {recipes.length === 0 && <p>Нет доступных рецептов</p>}
                    {recipes.map(recipe => {
                        const isAuthor = recipe.author === currentUser.email;

                        return (
                            <div key={recipe.id} className="p-4 border border-gray-200 rounded-lg mb-6 shadow-sm bg-white">
                                <h3 className="text-lg font-bold">{recipe.title}</h3>
                                <p className="mb-1">{recipe.description}</p>
                                <p className="text-sm text-gray-600">
                                    <strong>Автор:</strong> {recipe.author}
                                </p>

                                {/* Купить ингредиенты */}
                                <button
                                    className="text-green-600 hover:underline text-sm my-2"
                                    onClick={() => handleBuyIngredients(recipe.id, recipe.recipe_ingredients || [])}
                                >
                                    🛒 Купить ингредиенты
                                </button>

                                {/* Кнопки только для автора */}
                                {isAuthor && (
                                    <div className="mt-2 space-x-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => setEditingRecipe(recipe)}
                                        >
                                            ✏️ Редактировать
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(recipe.id)}
                                        >
                                            🗑 Удалить
                                        </button>
                                    </div>
                                )}

                                <RecipeIngredients recipeId={recipe.id} isAuthor={isAuthor} />
                                <CommentSection recipeId={recipe.id} />
                            </div>
                        );
                    })}
                </>
            )}

            {editingRecipe && (
                <EditRecipeModal
                    recipe={editingRecipe}
                    onClose={() => setEditingRecipe(null)}
                    onUpdated={() => {
                        setEditingRecipe(null);
                        fetchRecipes();
                    }}
                />
            )}
        </div>
    );
};

export default RecipeList;
