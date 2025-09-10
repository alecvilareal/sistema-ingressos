// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import App from "../App";

// 1. Importe os novos componentes
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../pages/organizer/DashboardPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Rotas Públicas
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },

      // 2. Crie um grupo de Rotas Protegidas
      {
        path: "/organizer",
        element: <ProtectedRoute />, // Este elemento protege todas as rotas filhas
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "create-event", element: <CreateEventPage /> },
        ],
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};