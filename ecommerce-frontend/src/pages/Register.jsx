import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // فحص قوة كلمة المرور (Page 17 بالـ PDF)
  const getPasswordStrength = (pass) => {
    if (!pass) return { text: '', color: '' };
    if (pass.length < 6) return { text: 'ضعيفة (أقل من 6 أحرف)', color: '#ef4444' };
    if (pass.length < 10) return { text: 'متوسطة 👍', color: '#f59e0b' };
    return { text: 'قوية وممتازة 💪', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة!');
      return;
    }

    if (!formData.agreeTerms) {
      setError('يرجى الموافقة على الشروط والأحكام أولاً');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setIsLoading(false);

      if (result.success) {
        alert(result.message);
        navigate('/login');
      } else {
        setError(result.message);
      }
    }, 600);
  };

  return (
    <div className="container" style={{ maxWidth: '460px', margin: '40px auto' }}>
      <div style={{ padding: '32px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--card-shadow)' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '20px' }}>إنشاء حساب جديد</h2>
        
        {error && (
          <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>الاسم الكامل *</label>
            <input 
              type="text" 
              placeholder="مثال: مصطفى الطراونة" 
              required 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
            />
          </div>
            
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>البريد الإلكتروني *</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
            />
          </div>
            
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>رقم الهاتف *</label>
            <input 
              type="tel" 
              placeholder="07XXXXXXXX" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>كلمة المرور *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="6 أحرف على الأقل" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ padding: '0 12px', background: 'var(--background-color)', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            {strength.text && (
              <span style={{ fontSize: '12px', color: strength.color, fontWeight: 600, marginTop: '4px', display: 'block' }}>
                قوة كلمة المرور: {strength.text}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>تأكيد كلمة المرور *</label>
            <input 
              type="password" 
              placeholder="أعد إدخال كلمة المرور" 
              required 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginTop: '6px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              required 
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} 
            />
            <span>أوافق على <a href="#terms" style={{ color: 'var(--secondary-color)', textDecoration: 'underline' }}>الشروط والأحكام</a> وسياسة الخصوصية</span>
          </label>

          <button 
            type="submit" 
            className="cta-button" 
            disabled={!formData.agreeTerms || isLoading} 
            style={{ width: '100%', border: 'none', padding: '14px', marginTop: '8px', opacity: (formData.agreeTerms && !isLoading) ? 1 : 0.5, cursor: (formData.agreeTerms && !isLoading) ? 'pointer' : 'not-allowed' }}
          >
            {isLoading ? '⏳ جاري إنشاء الحساب...' : 'تسجيل حساب جديد'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px' }}>
          لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>سجل دخولك</Link>
        </p>
      </div>
    </div>
  );
}