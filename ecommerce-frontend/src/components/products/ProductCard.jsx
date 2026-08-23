import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); 

  return (
    <div className="product-card">
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
          onClick={() => addToCart(product)} 
        >
          {product.stockQuantity === 0 ? 'نفد من المخزون' : 'أضف للسلة'}
        </button>
      </div>
    </div>
  );
}