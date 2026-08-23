import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // تأكد من وجود هذا السطر
import './layout.css';

export default function Navbar() {
  const { cartCount } = useCart(); // جلب العدد المتغير

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">BAT<span>TECHNO</span></Link>
        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/products">المنتجات</Link></li>
          {/* هنا يجب كتابة {cartCount} بين القوسين */}
          <li><Link to="/cart">السلة ({cartCount})</Link></li>
          <li><Link to="/login">حسابي</Link></li>
        </ul>
      </div>
    </nav>
  );
}