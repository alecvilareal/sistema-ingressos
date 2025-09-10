// src/routes/index.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importação do Layout Principal e Rotas de Proteção
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";

// Importação das Páginas Públicas
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import EventDetailPage from "../pages/EventDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from '../pages/PaymentSuccessPage'; // 1. Importe
import PaymentFailurePage from '../pages/PaymentFailurePage'; // 2. Importe

// Importação das Páginas do Organizador (Protegidas)
import DashboardPage from "../pages/organizer/DashboardPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";
import ManageEventPage from "../pages/organizer/ManageEventPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App.jsx serve como o layout principal para todas as páginas
    children: [
      // --- Rotas Públicas ---
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/event/:eventId", // Rota dinâmica para detalhes do evento
        element: <EventDetailPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      { path: "/payment-success",
        element: <PaymentSuccessPage /> },

      { path: "/payment-failure",
        element: <PaymentFailurePage /> },
      
      // --- Rotas Protegidas para Organizadores ---
      {
        path: "/organizer",
        element: <ProtectedRoute />, // Este componente protege todas as rotas filhas
        children: [
          {
            path: "dashboard", // Acessível em /organizer/dashboard
            element: <DashboardPage />,
          },
          {
            path: "create-event", // Acessível em /organizer/create-event
            element: <CreateEventPage />,
          },
          {
            path: "manage-event/:eventId", // Rota dinâmica para gerenciar um evento específico
            element: <ManageEventPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};