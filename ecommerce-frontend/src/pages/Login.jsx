import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // حالة Loading تجريبية (Page 10)
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة استجابة الشبكة بحالة Loading
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      
      if (success) {
        navigate('/'); 
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة!');
      }
    }, 600);
  };

  return (
    <div className="container" style={{ maxWidth: '420px', margin: '60px auto' }}>
      <div style={{ padding: '32px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--card-shadow)' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', margin: '0 0 20px 0' }}>تسجيل الدخول</h2>
        
        {error && (
          <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--primary-color)' }}>
              البريد الإلكتروني
            </label>
            <input 
              id="login-email"
              type="email" 
              placeholder="name@store.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div>
            <label htmlFor="login-password" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--primary-color)' }}>
              كلمة المرور
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                id="login-password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ padding: '0 14px', background: 'var(--background-color)', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="cta-button" 
            disabled={isLoading}
            style={{ width: '100%', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', padding: '14px', marginTop: '6px', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? '⏳ جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '14px', background: 'var(--background-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--muted-text-color)', lineHeight: '1.8' }}>
          <p style={{ fontWeight: 600, color: 'var(--primary-color)', marginBottom: '4px' }}>💡 حسابات تجريبية سريعة:</p>
          <p><strong>حساب العميل:</strong> customer@store.com | <strong>كلمة المرور:</strong> password123</p>
          <p><strong>حساب الأدمن:</strong> admin@store.com | <strong>كلمة المرور:</strong> password123</p>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px' }}>
          ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>أنشئ حساباً الآن</Link>
        </p>
      </div>
    </div>
  );
}