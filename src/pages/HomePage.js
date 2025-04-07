// src/pages/HomePage.js
import React from 'react';
import RecipeList from '../recipes/RecipeList';

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <RecipeList />
        </div>
    );
};

export default HomePage;
