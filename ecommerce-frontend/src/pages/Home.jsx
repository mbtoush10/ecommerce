import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import './Home.css';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-content">
          <h1>مرحباً بك في BAT TECHNO</h1>
          <p>أفضل الأجهزة والملحقات التقنية للمبرمجين واللاعبين بأفضل الأسعار.</p>
          <Link to="/products" className="cta-button">تسوق جميع المنتجات</Link>
        </div>
      </section>

      <section className="featured-section container">
        <h2>المنتجات المميزة</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}