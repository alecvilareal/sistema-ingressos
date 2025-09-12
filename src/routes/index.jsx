import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import EventDetailPage from "../pages/EventDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailurePage from "../pages/PaymentFailurePage";
import MyTicketsPage from "../pages/MyTicketsPage";

// Importa o novo componente de rota
import RoleBasedRoute from "./RoleBasedRoute";

// Importa as páginas do organizador
import DashboardPage from "../pages/organizer/DashboardPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";
import ManageEventPage from "../pages/organizer/ManageEventPage";
import CheckInPage from "../pages/organizer/CheckInPage";

// (Opcional, mas recomendado) Crie uma página placeholder para o painel de admin
const AdminUsersPage = () => <div>Página de Gestão de Usuários (Admin)</div>;


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- ROTAS PÚBLICAS ---
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/event/:eventId", element: <EventDetailPage /> },
      
      // --- ROTAS PARA QUALQUER USUÁRIO LOGADO ---
      { 
        element: <RoleBasedRoute />, // Protege contra não logados, mas permite qualquer papel
        children: [
          { path: "/my-tickets", element: <MyTicketsPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          // As páginas de status não precisam de ser protegidas
          { path: "/payment-success", element: <PaymentSuccessPage /> },
          { path: "/payment-failure", element: <PaymentFailurePage /> },
        ]
      },

      // --- ROTAS DE ORGANIZADOR (PROMOTOR, FUNCIONÁRIO, ADMIN) ---
      // Vamos assumir que o painel é para todos os tipos de staff por agora
      {
        element: <RoleBasedRoute allowedRoles={['admin', 'promoter', 'funcionario']} />,
        children: [
            { path: "/organizer/dashboard", element: <DashboardPage /> },
            { path: "/organizer/create-event", element: <CreateEventPage /> },
            { path: "/organizer/manage-event/:eventId", element: <ManageEventPage /> },
        ]
      },
      
      // --- ROTAS ESPECÍFICAS DE FUNCIONÁRIO E ADMIN ---
      {
        element: <RoleBasedRoute allowedRoles={['admin', 'funcionario']} />,
        children: [
            { path: "/organizer/check-in", element: <CheckInPage /> },
        ]
      },

      // --- ROTAS EXCLUSIVAS DE ADMIN ---
      {
        element: <RoleBasedRoute allowedRoles={['admin']} />,
        children: [
            { path: "/admin/users", element: <AdminUsersPage /> },
            // Outras rotas de admin aqui
        ]
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};