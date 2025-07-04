import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  // Allow access if user exists and their role is in allowedRoles or is admin
  if (!user || (!allowedRoles.includes(user.role) && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
