import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import './Products.css';

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');

  const [searchTerm, setSearchTerm] = useState(searchFromUrl || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [categoryFromUrl, searchFromUrl]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setInStockOnly(false);
    setSortBy('default');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  // فلترة المنتجات
  let filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchStock = inStockOnly ? product.stockQuantity > 0 : true;
    const matchMinPrice = minPrice === '' || product.price >= Number(minPrice);
    const matchMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);
    
    return matchSearch && matchCategory && matchStock && matchMinPrice && matchMaxPrice;
  });

  // الترتيب
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-a-z') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  // حساب Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="products-page container">
      <div className="page-header">
        <div>
          <h1>جميع المنتجات</h1>
          <span className="results-count">تم العثور على {filteredProducts.length} منتج</span>
        </div>

        {/* زر إظهار/إخفاء الفلاتر للهواتف (Drawer/Collapsible) */}
        <button 
          className="mobile-filter-toggle" 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          {showMobileFilters ? '✖ إخفاء الفلاتر' : '⚙️ تصفية وبحث'}
        </button>
      </div>

      <div className={`filters-bar ${showMobileFilters ? 'filters-open' : ''}`}>
        <div className="filter-group">
          <label htmlFor="search-input">البحث بالاسم</label>
          <input 
            id="search-input"
            type="text" 
            className="filter-input" 
            placeholder="ابحث عن منتج..." 
            value={searchTerm}
            onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category-select">التصنيف</label>
          <select 
            id="category-select"
            className="filter-input"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory)(e.target.value)}
          >
            <option value="All">الكل</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">الترتيب حسب</label>
          <select 
            id="sort-select"
            className="filter-input"
            value={sortBy}
            onChange={(e) => handleFilterChange(setSortBy)(e.target.value)}
          >
            <option value="default">الافتراضي</option>
            <option value="price-low">السعر: الأقل إلى الأعلى</option>
            <option value="price-high">السعر: الأعلى إلى الأقل</option>
            <option value="name-a-z">الاسم: أ - ي</option>
          </select>
        </div>

        {/* فلتر السعر */}
        <div className="filter-group price-range-group">
          <label>نطاق السعر ($)</label>
          <div className="price-range-inputs">
            <input 
              type="number" 
              className="filter-input price-input" 
              placeholder="من" 
              min="0"
              value={minPrice}
              onChange={(e) => handleFilterChange(setMinPrice)(e.target.value)}
              aria-label="الحد الأدنى للسعر"
            />
            <span className="price-separator">-</span>
            <input 
              type="number" 
              className="filter-input price-input" 
              placeholder="إلى" 
              min="0"
              value={maxPrice}
              onChange={(e) => handleFilterChange(setMaxPrice)(e.target.value)}
              aria-label="الحد الأعلى للسعر"
            />
          </div>
        </div>

        <div className="filter-group checkbox-group">
          <input 
            type="checkbox" 
            id="inStock" 
            checked={inStockOnly}
            onChange={(e) => handleFilterChange(setInStockOnly)(e.target.checked)}
          />
          <label htmlFor="inStock" style={{margin: 0}}>متوفر بالمخزون فقط</label>
        </div>

        <button className="clear-btn" onClick={clearFilters}>مسح الفلاتر</button>
      </div>

      {paginatedProducts.length > 0 ? (
        <>
          <div className="products-grid">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                aria-label="الصفحة السابقة"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`الصفحة ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                aria-label="الصفحة التالية"
              >
                →
              </button>
            </div>
          )}
        </>
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