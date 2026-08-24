import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 
import Toast from '../common/Toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); 
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleAddToCart = () => {
    const result = addToCart(product);
    setToast({
      isVisible: true,
      message: result.message,
      type: result.success ? 'success' : 'warning'
    });
  };

  return (
    <div className="product-card">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-details">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <span className="product-price">${product.price}</span>
        
        <button 
          className={`add-to-cart-btn ${product.stockQuantity === 0 ? 'out-of-stock' : ''}`}
          disabled={product.stockQuantity === 0}
          onClick={handleAddToCart} 
          aria-label={product.stockQuantity === 0 ? 'نفد من المخزون' : `أضف ${product.name} للسلة`}
        >
          {product.stockQuantity === 0 ? 'نفد من المخزون' : 'أضف للسلة'}
        </button>
      </div>
    </div>
  );
}