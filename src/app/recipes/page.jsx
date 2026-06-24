import React, { Suspense } from 'react';
import BrowseAllProduct from './BrowseAllProduct';

const RecipesPage = () => {
    return (
        <Suspense>
            <BrowseAllProduct></BrowseAllProduct>
        </Suspense>
    );
};

export default RecipesPage;