import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componente Principal de Layout
import App from "../App";

// Componente de Rota Protegida
import ProtectedRoute from "./ProtectedRoute";

// Páginas Públicas
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import EventDetailPage from "../pages/EventDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailurePage from "../pages/PaymentFailurePage";

// Páginas Protegidas do Organizador
import DashboardPage from "../pages/organizer/DashboardPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";
import ManageEventPage from "../pages/organizer/ManageEventPage";

// Páginas Protegidas do Cliente
import MyTicketsPage from "../pages/MyTicketsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- Rotas Públicas ---
      { 
        path: "/", 
        element: <HomePage /> 
      },
      { 
        path: "/login", 
        element: <LoginPage /> 
      },
      { 
        path: "/event/:eventId", 
        element: <EventDetailPage /> 
      },
      { 
        path: "/checkout", 
        element: <CheckoutPage /> 
      },
      { 
        path: "/payment-success", 
        element: <PaymentSuccessPage /> 
      },
      { 
        path: "/payment-failure", 
        element: <PaymentFailurePage /> 
      },

      // --- Rotas Protegidas ---
      {
        element: <ProtectedRoute />, // Este componente protege todas as rotas filhas
        children: [
          // Rotas do Organizador
          { 
            path: "/organizer/dashboard", 
            element: <DashboardPage /> 
          },
          { 
            path: "/organizer/create-event", 
            element: <CreateEventPage /> 
          },
          { 
            path: "/organizer/manage-event/:eventId", 
            element: <ManageEventPage /> 
          },
          // Rota do Cliente
          {
            path: "/my-tickets",
            element: <MyTicketsPage />
          }
        ]
      }
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};