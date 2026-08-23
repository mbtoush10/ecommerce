import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  // تصميم حالة السلة الفارغة (Empty State)
  if (cart.length === 0) {
    return (
      <div className="cart-page container" style={{textAlign: 'center', padding: '100px 20px'}}>
        <h2>سلة المشتريات فارغة! 🛒</h2>
        <p style={{color: 'var(--muted-text-color)', margin: '20px 0'}}>لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
        <Link to="/products" className="cta-button">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">سلة المشتريات</h1>
      
      <div className="cart-container">
        {/* قسم عرض المنتجات */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${item.price}</div>
                
                {/* أزرار تعديل الكمية */}
                <div className="quantity-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.stockQuantity)}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.stockQuantity)}
                  >+</button>
                </div>
                
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  حذف المنتج
                </button>
              </div>
              
              <div className="cart-item-total">
                <strong>${item.price * item.quantity}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* قسم ملخص الطلب */}
        <div className="cart-summary">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span>المجموع الفرعي:</span>
            <span>${cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>التوصيل:</span>
            <span>مجاني</span>
          </div>
          <div className="summary-row summary-total">
            <span>الإجمالي:</span>
            <span>${cartTotal}</span>
          </div>
          
          <Link to="/checkout">
            <button className="checkout-btn">متابعة إتمام الطلب</button>
          </Link>
        </div>
      </div>
    </div>
  );
}