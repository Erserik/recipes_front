import React, { useState } from 'react';
import RecipeList from '../recipes/RecipeList';
import RecipeForm from '../recipes/RecipeForm';

const HomePage = () => {
    const [reloadKey, setReloadKey] = useState(0);
    const handleCreated = () => setReloadKey(prev => prev + 1);

    return (
        <div style={{ padding: '20px' }}>
            <RecipeForm onCreated={handleCreated} />
            <RecipeList key={reloadKey} />
        </div>
    );
};

export default HomePage;
