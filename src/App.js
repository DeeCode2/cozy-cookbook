import { AuthContextProvider } from './config/AuthContext';
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from './config/ProtectedRoute';
import './App.scss';

//components
import SignIn from './components/user-forms/SignIn.js';
import SignUp from './components/user-forms/SignUp.js';
import RecipesGallery from './components/recipes/RecipeGallery.js';
import Recipe from './components/recipes/Recipe.js';
import Create from './components/rec-forms/Create.js';
import Edit from './components/rec-forms/Edit.js';
import Lists from './components/lists/Lists.js';
import ShoppingList from './components/lists/ShoppingList.js';
import Results from './components/results/Results.js';
import NotFound from './components/NotFound.js';
import Navbar from './components/Navbar.js';


function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path="recipes" element={<ProtectedRoute><RecipesGallery /></ProtectedRoute>} />
        {/* <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} /> */}
        <Route path="create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/recipes/:recId" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
        {/* <Route path="shoppinglists" element={<ProtectedRoute><Lists /></ProtectedRoute>} /> */}
        <Route path="/recipes/:recId/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        {/* 
        <Route path="shoppinglists" element={<ProtectedRoute><Lists /></ProtectedRoute>} />
        <Route path="shoppinglists/:listId" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
        <Route path="results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </AuthContextProvider>
  );
}

export default App;