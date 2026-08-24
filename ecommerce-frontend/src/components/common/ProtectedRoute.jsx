import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();

  // إذا المستخدم مش مسجل دخول، ننقله لصفحة الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا المسار يتطلب صلاحيات أدمن والمستخدم مش أدمن
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
