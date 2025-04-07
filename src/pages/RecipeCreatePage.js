// src/pages/RecipeCreatePage.js
import React, { useState } from 'react';
import RecipeForm from '../recipes/RecipeForm';

const RecipeCreatePage = ({ onBack }) => {
    const [created, setCreated] = useState(false);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">➕ Добавить рецепт</h2>
            {created && <p className="text-green-600 mb-4">✅ Рецепт добавлен!</p>}

            <RecipeForm onCreated={() => setCreated(true)} />

            <button
                onClick={onBack}
                className="mt-4 text-blue-600 hover:underline"
            >
                ← Назад к списку
            </button>
        </div>
    );
};

export default RecipeCreatePage;
