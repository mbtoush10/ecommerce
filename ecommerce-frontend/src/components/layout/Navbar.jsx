import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; 
import ConfirmDialog from '../common/ConfirmDialog';
import './layout.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    closeMobileMenu();
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="القائمة الرئيسية">
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        confirmText="خروج"
        cancelText="البقاء"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <div className="container navbar-content">
        <Link to="/" className="logo" onClick={closeMobileMenu}>BAT<span>TECHNO</span></Link>
        
        {/* زر Hamburger للموبايل */}
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="فتح القائمة"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <li><Link to="/" onClick={closeMobileMenu}>الرئيسية</Link></li>
          <li><Link to="/products" onClick={closeMobileMenu}>المنتجات</Link></li>
          <li><Link to="/cart" onClick={closeMobileMenu}>السلة ({cartCount})</Link></li>
          
          {/* هنا نفحص: هل المستخدم مسجل دخول؟ */}
          {user ? (
            <>
              {user.role === 'admin' && <li><Link to="/admin" onClick={closeMobileMenu} style={{color: 'var(--secondary-color)'}}>لوحة الإدارة</Link></li>}
              
              <li><Link to="/profile" onClick={closeMobileMenu} style={{ color: '#d1d5db', textDecoration: 'underline' }}>أهلاً، {user.fullName.split(' ')[0]}</Link></li>
              <li>
                <button onClick={handleLogout} style={{ background: 'none', color: 'var(--error-color)', cursor: 'pointer', fontWeight: 'bold' }}>
                  خروج
                </button>
              </li>
            </>
          ) : (
            /* إذا مش مسجل دخول، بنعرضله هدول الرابطين */
            <>
              <li><Link to="/login" onClick={closeMobileMenu}>تسجيل الدخول</Link></li>
              <li><Link to="/register" onClick={closeMobileMenu}>إنشاء حساب</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}