import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import './Home.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const featuredProducts = products.filter(p => p.stockQuantity > 0).slice(0, 4);
  const latestProducts = products.filter(p => p.stockQuantity > 0).slice(-4).reverse();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1>مرحباً بك في BAT TECHNO</h1>
          <p>أفضل الأجهزة والملحقات التقنية للمبرمجين واللاعبين بأفضل الأسعار.</p>
          
          {/* مربع بحث تفاعلي ينتقل لصفحة المنتجات */}
          <form onSubmit={handleSearch} className="hero-search-box">
            <input 
              type="text" 
              placeholder="ابحث عن لابتوب، ماوس، سماعة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
              aria-label="البحث عن منتج"
            />
            <button type="submit" className="hero-search-btn">🔍 بحث</button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <Link to="/products" className="cta-button">تسوق جميع المنتجات</Link>
          </div>
        </div>
      </section>

      {/* قسم التصنيفات */}
      <section className="categories-section container">
        <h2>تصفح حسب التصنيف</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* المنتجات المميزة */}
      <section className="featured-section container">
        <h2>المنتجات المميزة</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* بانر ترويجي */}
      <section className="promo-banner">
        <div className="container banner-content">
          <div className="banner-text">
            <h2>🔥 عروض نهاية الموسم</h2>
            <p>خصومات تصل إلى 40% على أجهزة اللابتوب وملحقات الألعاب. العرض لفترة محدودة!</p>
            <Link to="/products" className="banner-btn">تسوق العروض الآن</Link>
          </div>
        </div>
      </section>

      {/* أحدث المنتجات */}
      <section className="latest-section container">
        <h2>أحدث المنتجات</h2>
        <div className="products-grid">
          {latestProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}