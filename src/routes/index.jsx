// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import App from "../App"; // Importaremos o App como layout principal

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // O App será o elemento pai (layout)
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      // ...outras rotas aqui
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};