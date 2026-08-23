import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--primary-color)', margin: '0' }}>404</h1>
      <h2 style={{ marginBottom: '10px' }}>الصفحة غير موجودة!</h2>
      <p style={{ color: 'var(--muted-text-color)', marginBottom: '30px' }}>
        عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو قيد الإنشاء.
      </p>
      <Link to="/" className="cta-button">العودة للصفحة الرئيسية</Link>
    </div>
  );
}