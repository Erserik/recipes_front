import React, { useEffect, useState } from 'react';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://erko123.pythonanywhere.com/api/v1/recipes/')
            .then(res => res.json())
            .then(data => setRecipes(data.results || []))
            .catch(() => setError('Не удалось загрузить рецепты'));
    }, []);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>📋 Рецепты</h2>
            {recipes.length === 0 && <p>Нет доступных рецептов</p>}
            {recipes.map(recipe => (
                <div key={recipe.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <p><strong>Автор:</strong> {recipe.author}</p>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
