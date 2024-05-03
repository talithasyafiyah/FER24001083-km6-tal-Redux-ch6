import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SearchRecipe from "./pages/user/SearchRecipe.jsx";
import ListCategories from "./pages/user/ListCategories.jsx";
import RecipeDetails from "./pages/user/RecipeDetails.jsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import NoAccessToken from "./components/NoAccessToken.jsx";
import Protected from "./components/Protected.jsx";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <LandingPage />
                    <NoAccessToken />
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/search-recipe"
                element={
                  <div>
                    <Protected />
                    <SearchRecipe />
                    <NoAccessToken />
                  </div>
                }
              />
              <Route
                path="/list-categories"
                element={
                  <div>
                    <Protected />
                    <ListCategories />
                    <NoAccessToken />
                  </div>
                }
              />
              <Route
                path="/recipe-details/:idMeal"
                element={
                  <div>
                    <Protected />
                    <RecipeDetails />
                    <NoAccessToken />
                  </div>
                }
              />
            </Routes>

            <ToastContainer />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
