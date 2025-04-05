import React, { useState, useEffect } from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeForm from '../recipes/RecipeForm';

const HomePage = () => {
    const [reloadKey, setReloadKey] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleCreated = () => setReloadKey(prev => prev + 1);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {isAuthenticated && (
                <div className="mb-8">
                    <RecipeForm onCreated={handleCreated} />
                </div>
            )}

            <RecipeList key={reloadKey} />
        </div>
    );
};

export default HomePage;
