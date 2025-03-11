import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PannelloOpzioni from './pages/PannelloOpzioni';
import CategoryGoodsPage from './pages/CategoryGoodsPage';
import ProcessingStatesPage from './pages/ProcessingStatesPage';
import ProcessingTypesPage from './pages/ProcessingTypesPage';
import UnitsPage from './pages/UnitsPage';
import QuantityTypesPage from './pages/QuantityTypesPage';
import ClientiPage from './pages/ClientiPage';
import SchedaCliente from './pages/SchedaCliente';
import IngredientsPage from './pages/IngredientsPage';
import IngredientDetail from './pages/IngredientDetail';
import RecipesPage from './pages/RecipesPage';
import RecipeDetail from './pages/RecipeDetail';
import CategoryRecipesPage from './pages/CategoryRecipesPage';
import MateriePrime from './pages/MateriePrime';
import StyleGuide from './pages/StyleGuide';
import FasiTypePage from './pages/FasiTypePage';
import FasiMethodPage from './pages/FasiMethodPage';
import TipoCotturaPage from './pages/TipoCotturaPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pannello-opzioni" element={<PannelloOpzioni />} />
          <Route path="/category-goods" element={<CategoryGoodsPage />} />
          <Route path="/processing-states" element={<ProcessingStatesPage />} />
          <Route path="/processing-types" element={<ProcessingTypesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/quantity-types" element={<QuantityTypesPage />} />
          <Route path="/clienti" element={<ClientiPage />} />
          <Route path="/clienti/:id" element={<SchedaCliente />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/ingredients/:id" element={<IngredientDetail />} />
          <Route path="/ricette" element={<RecipesPage />} />
          <Route path="/ricette/:id" element={<RecipeDetail />} />
          <Route path="/category-recipes" element={<CategoryRecipesPage />} />
          <Route path="/materie-prime" element={<MateriePrime />} />
          <Route path="/fasi-types" element={<FasiTypePage />} />
          <Route path="/fasi-methods" element={<FasiMethodPage />} />
          <Route path="/tipo-cotture" element={<TipoCotturaPage />} />
          <Route path="/styleguide" element={<StyleGuide />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
