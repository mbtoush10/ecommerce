import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Toast from '../components/common/Toast';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: 'var(--error-color)', marginBottom: '20px' }}>المنتج غير موجود!</h2>
        <button className="cta-button" onClick={() => navigate('/products')}>العودة لتصفح المنتجات</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const result = addToCart(product, selectedQty);
    setToast({
      isVisible: true,
      message: result.message,
      type: result.success ? 'success' : 'warning'
    });
  };

  // حالة المخزون (متوفر، كمية محدودة، نفد من المخزون) - Page 9 بالـ PDF
  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return { text: 'نفد من المخزون ❌', className: 'stock-out' };
    }
    if (product.stockQuantity <= 5) {
      return { text: `كمية محدودة جداً! (باقي ${product.stockQuantity} قطع فقط ⚠️)`, className: 'stock-limited' };
    }
    return { text: `متوفر بالمخزون (${product.stockQuantity} قطعة) ✅`, className: 'stock-available' };
  };

  const stockInfo = getStockStatus();

  // فلترة المنتجات المشابهة
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      <div style={{ padding: '20px 0 0 0' }}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="العودة للصفحة السابقة">← العودة للسابق</button>
      </div>

      <div className="product-details-container">
        <img src={product.image} alt={product.name} className="product-details-image" />
        
        <div className="product-details-info">
          <span className="product-details-category">{product.category}</span>
          <h1 className="product-details-title">{product.name}</h1>
          <div className="product-details-price">${product.price}</div>
          
          {/* حالة المخزون */}
          <div className={`stock-info ${stockInfo.className}`}>
            {stockInfo.text}
          </div>
          
          <p className="product-details-desc">{product.description}</p>
          
          {/* اختيار الكمية قبل الإضافة */}
          {product.stockQuantity > 0 && (
            <div className="details-quantity-wrapper">
              <label>الكمية المطلوبة:</label>
              <div className="quantity-selector">
                <button 
                  type="button"
                  className="qty-btn"
                  onClick={() => setSelectedQty(prev => Math.max(1, prev - 1))}
                  disabled={selectedQty <= 1}
                >-</button>
                <span className="qty-number">{selectedQty}</span>
                <button 
                  type="button"
                  className="qty-btn"
                  onClick={() => setSelectedQty(prev => Math.min(product.stockQuantity, prev + 1))}
                  disabled={selectedQty >= product.stockQuantity}
                >+</button>
              </div>
            </div>
          )}

          <button 
            className={`cta-button ${product.stockQuantity === 0 ? 'out-of-stock' : ''}`}
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart}
            style={{ width: 'fit-content', padding: '15px 40px', fontSize: '18px', marginTop: '15px' }}
            aria-label={product.stockQuantity === 0 ? 'نفد من المخزون' : `أضف ${product.name} إلى السلة`}
          >
            {product.stockQuantity === 0 ? 'نفد من المخزون' : 'أضف إلى السلة 🛒'}
          </button>
        </div>
      </div>

      {/* قسم المنتجات المشابهة */}
      {similarProducts.length > 0 && (
        <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '30px', marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>منتجات مشابهة</h2>
          <div className="products-grid">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}