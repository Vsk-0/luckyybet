import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean; // Add optional prop to check for admin
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { currentUser, isAdmin, loading } = useAuth(); // Get isAdmin status

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Simple text loading indicator */}
        <p className="text-purple-500">Carregando...</p>
        {/* Or keep the spinner if preferred */}
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div> */}
      </div>
    );
  }

  if (!currentUser) {
    // If not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    // If adminOnly route and user is not admin, redirect to dashboard or home
    console.warn('Acesso negado: Rota apenas para administradores.');
    return <Navigate to="/dashboard" replace />; // Or redirect to home '/' 
  }

  // If logged in (and admin if required), render the children
  return <>{children}</>;
};

export default ProtectedRoute;

