import { useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import './Products.css';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setInStockOnly(false);
    setSortBy('default');
  };

  let filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchStock = inStockOnly ? product.stockQuantity > 0 : true;
    
    return matchSearch && matchCategory && matchStock;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-a-z') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="products-page container">
      <div className="page-header">
        <h1>جميع المنتجات</h1>
        <span className="results-count">تم العثور على {filteredProducts.length} منتج</span>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>البحث بالاسم</label>
          <input 
            type="text" 
            className="filter-input" 
            placeholder="ابحث عن منتج..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>التصنيف</label>
          <select 
            className="filter-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">الكل</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>الترتيب حسب</label>
          <select 
            className="filter-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">الافتراضي</option>
            <option value="price-low">السعر: الأقل إلى الأعلى</option>
            <option value="price-high">السعر: الأعلى إلى الأقل</option>
            <option value="name-a-z">الاسم: أ - ي</option>
          </select>
        </div>

        <div className="filter-group checkbox-group">
          <input 
            type="checkbox" 
            id="inStock" 
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <label htmlFor="inStock" style={{margin: 0}}>متوفر بالمخزون فقط</label>
        </div>

        <button className="clear-btn" onClick={clearFilters}>مسح الفلاتر</button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h2>لا توجد نتائج!</h2>
          <p>لم نتمكن من العثور على منتجات تطابق بحثك. جرب تغيير الفلاتر.</p>
          <button className="cta-button" style={{marginTop: '15px'}} onClick={clearFilters}>
            عرض كل المنتجات
          </button>
        </div>
      )}
    </div>
  );
}