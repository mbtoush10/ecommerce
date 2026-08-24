import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { mockOrders } from '../data/orders';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  // States للبيانات والتبويبات
  const [activeTab, setActiveTab] = useState('overview');
  const [localProducts, setLocalProducts] = useState(products);
  const [localOrders, setLocalOrders] = useState(mockOrders);
  const [localCategories, setLocalCategories] = useState(categories);
  
  // فلاتر جدول المنتجات
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // نوافذ التأكيد والتنبيه
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null, productName: '', currentStatus: true });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Modal إضافة وتعديل منتج
  const [productModal, setProductModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    productId: null,
    formData: {
      name: '',
      price: '',
      stockQuantity: '',
      category: categories[0]?.name || 'Laptops',
      description: '',
      image: ''
    },
    errors: {}
  });

  // دوال تفعيل/تعطيل المنتج
  const handleToggleClick = (id, name, isActive) => {
    setConfirmDialog({ isOpen: true, productId: id, productName: name, currentStatus: isActive });
  };

  const confirmToggle = () => {
    setLocalProducts(prev => prev.map(p => 
      p.id === confirmDialog.productId ? { ...p, isActive: !p.isActive } : p
    ));
    const newStatus = !confirmDialog.currentStatus;
    setConfirmDialog({ isOpen: false, productId: null, productName: '', currentStatus: true });
    setToast({
      isVisible: true,
      message: `تم ${newStatus ? 'تفعيل' : 'تعطيل'} المنتج بنجاح!`,
      type: newStatus ? 'success' : 'warning'
    });
  };

  // تعديل حالة الطلب محلياً
  const updateOrderStatus = (id, newStatus) => {
    setLocalOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setToast({
      isVisible: true,
      message: `تم تحديث حالة الطلب ${id} إلى "${newStatus}"`,
      type: 'info'
    });
  };

  // فتح Modal إضافة منتج
  const openAddProductModal = () => {
    setProductModal({
      isOpen: true,
      mode: 'add',
      productId: null,
      formData: {
        name: '',
        price: '',
        stockQuantity: '',
        category: categories[0]?.name || 'Laptops',
        description: '',
        image: 'https://placehold.co/400?text=New+Product'
      },
      errors: {}
    });
  };

  // فتح Modal تعديل منتج
  const openEditProductModal = (product) => {
    setProductModal({
      isOpen: true,
      mode: 'edit',
      productId: product.id,
      formData: {
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category,
        description: product.description || '',
        image: product.image
      },
      errors: {}
    });
  };

  // التحقق من مدخلات نموذج المنتج (Page 17 بالـ PDF)
  const validateProductForm = () => {
    const errors = {};
    const { name, price, stockQuantity, category, image } = productModal.formData;

    if (!name.trim()) errors.name = 'اسم المنتج مطلوب';
    if (price === '' || Number(price) <= 0) errors.price = 'يرجى إدخال سعر صالح أكبر من صفر';
    if (stockQuantity === '' || Number(stockQuantity) < 0) errors.stockQuantity = 'يرجى إدخال كمية مخزون صحيحة';
    if (!category) errors.category = 'التصنيف مطلوب';
    if (!image.trim()) errors.image = 'رابط الصورة مطلوب';

    setProductModal(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // حفظ المنتج (إضافة أو تعديل)
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    if (productModal.mode === 'add') {
      const newProduct = {
        id: Date.now(),
        name: productModal.formData.name,
        price: Number(productModal.formData.price),
        stockQuantity: Number(productModal.formData.stockQuantity),
        category: productModal.formData.category,
        description: productModal.formData.description || 'منتج جديد تمت إضافته محلياً.',
        image: productModal.formData.image,
        isActive: true
      };
      setLocalProducts(prev => [newProduct, ...prev]);
      setToast({ isVisible: true, message: 'تمت إضافة المنتج بنجاح!', type: 'success' });
    } else {
      setLocalProducts(prev => prev.map(p => 
        p.id === productModal.productId 
          ? {
              ...p,
              name: productModal.formData.name,
              price: Number(productModal.formData.price),
              stockQuantity: Number(productModal.formData.stockQuantity),
              category: productModal.formData.category,
              description: productModal.formData.description,
              image: productModal.formData.image
            }
          : p
      ));
      setToast({ isVisible: true, message: 'تم تحديث بيانات المنتج بنجاح!', type: 'success' });
    }

    setProductModal(prev => ({ ...prev, isOpen: false }));
  };

  // فلترة المنتجات في جدول الإدارة (بحث + تصنيف)
  const filteredProducts = localProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container dashboard-layout">
      {/* إشعار Toast */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      {/* نافذة تأكيد تعطيل/تفعيل المنتج */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.currentStatus ? 'تعطيل المنتج' : 'تفعيل المنتج'}
        message={`هل أنت متأكد من ${confirmDialog.currentStatus ? 'تعطيل' : 'تفعيل'} المنتج "${confirmDialog.productName}"؟`}
        confirmText={confirmDialog.currentStatus ? 'تعطيل' : 'تفعيل'}
        cancelText="إلغاء"
        variant={confirmDialog.currentStatus ? 'danger' : 'success'}
        onConfirm={confirmToggle}
        onCancel={() => setConfirmDialog({ isOpen: false, productId: null, productName: '', currentStatus: true })}
      />

      {/* Modal إضافة وتعديل منتج */}
      {productModal.isOpen && (
        <div className="admin-modal-overlay" onClick={() => setProductModal(prev => ({ ...prev, isOpen: false }))}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{productModal.mode === 'add' ? '✨ إضافة منتج تجريبي جديد' : '✏️ تعديل بيانات المنتج'}</h3>
              <button 
                className="close-modal-btn" 
                onClick={() => setProductModal(prev => ({ ...prev, isOpen: false }))}
                aria-label="إغلاق"
              >×</button>
            </div>

            <form onSubmit={handleProductSubmit} className="admin-modal-form" noValidate>
              <div className={`form-group ${productModal.errors.name ? 'has-error' : ''}`}>
                <label>اسم المنتج *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={productModal.formData.name}
                  onChange={e => setProductModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, name: e.target.value }
                  }))}
                  placeholder="مثال: لوحة مفاتيح ميكانيكية"
                />
                {productModal.errors.name && <span className="field-error">{productModal.errors.name}</span>}
              </div>

              <div className="modal-row">
                <div className={`form-group ${productModal.errors.price ? 'has-error' : ''}`}>
                  <label>السعر ($) *</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-input" 
                    value={productModal.formData.price}
                    onChange={e => setProductModal(prev => ({
                      ...prev,
                      formData: { ...prev.formData, price: e.target.value }
                    }))}
                    placeholder="100"
                  />
                  {productModal.errors.price && <span className="field-error">{productModal.errors.price}</span>}
                </div>

                <div className={`form-group ${productModal.errors.stockQuantity ? 'has-error' : ''}`}>
                  <label>كمية المخزون *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="form-input" 
                    value={productModal.formData.stockQuantity}
                    onChange={e => setProductModal(prev => ({
                      ...prev,
                      formData: { ...prev.formData, stockQuantity: e.target.value }
                    }))}
                    placeholder="10"
                  />
                  {productModal.errors.stockQuantity && <span className="field-error">{productModal.errors.stockQuantity}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>التصنيف *</label>
                <select 
                  className="form-input"
                  value={productModal.formData.category}
                  onChange={e => setProductModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, category: e.target.value }
                  }))}
                >
                  {localCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={`form-group ${productModal.errors.image ? 'has-error' : ''}`}>
                <label>رابط الصورة *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={productModal.formData.image}
                  onChange={e => setProductModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, image: e.target.value }
                  }))}
                  placeholder="https://placehold.co/400"
                />
                {productModal.errors.image && <span className="field-error">{productModal.errors.image}</span>}
              </div>

              <div className="form-group">
                <label>الوصف</label>
                <textarea 
                  className="form-input"
                  rows="2"
                  value={productModal.formData.description}
                  onChange={e => setProductModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, description: e.target.value }
                  }))}
                  placeholder="وصف مختصر للمنتج..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setProductModal(prev => ({ ...prev, isOpen: false }))}
                >
                  إلغاء
                </button>
                <button type="submit" className="cta-button">
                  {productModal.mode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Sidebar Navigation (AdminSidebar) */}
      <aside className="admin-sidebar">
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>لوحة التحكم</h3>
        <p style={{ fontSize: '13px', color: 'var(--muted-text-color)', marginBottom: '20px' }}>
          مرحباً، <strong>{user?.fullName}</strong> ({user?.role})
        </p>
        <button className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 نظرة عامة</button>
        <button className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>📦 إدارة المنتجات ({localProducts.length})</button>
        <button className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📑 إدارة الطلبات ({localOrders.length})</button>
        <button className={`admin-nav-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>🏷️ التصنيفات ({localCategories.length})</button>
      </aside>

      {/* 2. Content Area */}
      <main className="admin-content">
        
        {/* تبويبة نظرة عامة */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>ملخص الإحصائيات</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>إجمالي المنتجات</h3>
                <div className="stat-value">{localProducts.length}</div>
              </div>
              <div className="stat-card">
                <h3>الطلبات</h3>
                <div className="stat-value">{localOrders.length}</div>
              </div>
              <div className="stat-card">
                <h3>المستخدمين</h3>
                <div className="stat-value">2</div>
              </div>
              <div className="stat-card">
                <h3>إجمالي المبيعات</h3>
                <div className="stat-value">${localOrders.reduce((sum, o) => sum + o.total, 0)}</div>
              </div>
            </div>

            <div className="admin-overview-section">
              <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>أحدث الطلبات</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>العميل</th>
                      <th>التاريخ</th>
                      <th>الإجمالي</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localOrders.slice(0, 3).map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customer}</td>
                        <td>{o.date}</td>
                        <td>${o.total}</td>
                        <td>
                          <span className={`status-badge status-${o.status}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* تبويبة المنتجات */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search-filter">
                <input 
                  type="text" 
                  className="filter-input"
                  placeholder="بحث عن منتج..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '220px' }}
                  aria-label="بحث في المنتجات"
                />
                <select 
                  className="filter-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="تصفية حسب التصنيف"
                >
                  <option value="All">كل التصنيفات</option>
                  {localCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button className="cta-button" onClick={openAddProductModal}>
                + إضافة منتج جديد
              </button>
            </div>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>التصنيف</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className={!p.isActive ? 'row-disabled' : ''}>
                      <td>
                        <div className="product-table-cell">
                          <img src={p.image} alt={p.name} className="product-table-thumb" />
                          <span className="product-table-name">{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>${p.price}</td>
                      <td>
                        <span style={{ color: p.stockQuantity === 0 ? 'var(--error-color)' : 'inherit', fontWeight: p.stockQuantity === 0 ? 'bold' : 'normal' }}>
                          {p.stockQuantity === 0 ? 'نفد (0)' : p.stockQuantity}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${p.isActive ? 'status-active' : 'status-disabled'}`}>
                          {p.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button 
                            className="action-btn btn-edit" 
                            onClick={() => openEditProductModal(p)}
                            aria-label={`تعديل ${p.name}`}
                          >
                            تعديل
                          </button>
                          <button 
                            className={`action-btn ${p.isActive ? 'btn-disable' : 'btn-enable'}`} 
                            onClick={() => handleToggleClick(p.id, p.name, p.isActive)}
                            aria-label={`${p.isActive ? 'تعطيل' : 'تفعيل'} ${p.name}`}
                          >
                            {p.isActive ? 'تعطيل' : 'تفعيل'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* تبويبة الطلبات */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>إدارة الطلبات</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>التاريخ</th>
                    <th>الإجمالي</th>
                    <th>تغيير الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {localOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>{o.customer}</td>
                      <td>{o.date}</td>
                      <td>${o.total}</td>
                      <td>
                        <select 
                          className="status-select"
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          aria-label={`تغيير حالة الطلب ${o.id}`}
                        >
                          <option value="قيد المعالجة">قيد المعالجة</option>
                          <option value="قيد التوصيل">قيد التوصيل</option>
                          <option value="مكتمل">مكتمل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* تبويبة التصنيفات */}
        {activeTab === 'categories' && (
          <div>
            <div className="admin-toolbar">
              <h2>التصنيفات المتاحة</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>اسم التصنيف</th>
                    <th>عدد المنتجات المرتبطة</th>
                  </tr>
                </thead>
                <tbody>
                  {localCategories.map(c => {
                    const count = localProducts.filter(p => p.category === c.name).length;
                    return (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>{count} منتجات</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}