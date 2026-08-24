import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, orderId: '' });

  if (cart.length === 0 && !successDialog.isOpen) {
    return <Navigate to="/cart" />;
  }

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب';
    
    if (!formData.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^07\d{8}$/.test(formData.phone)) {
      errors.phone = 'صيغة الهاتف غير صحيحة (07XXXXXXXX)';
    }
    
    if (!formData.address.trim()) errors.address = 'العنوان مطلوب';
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'رقم البطاقة مطلوب';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'رقم البطاقة يجب أن يكون 16 رقم';
      }
      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = 'تاريخ الانتهاء مطلوب';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.cardExpiry = 'الصيغة: MM/YY';
      }
      if (!formData.cardCVV.trim()) {
        errors.cardCVV = 'رمز CVV مطلوب';
      } else if (!/^\d{3}$/.test(formData.cardCVV)) {
        errors.cardCVV = 'CVV يجب أن يكون 3 أرقام';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // إنشاء طلب تجريبي
    const newOrder = {
      id: `#ORD-${String(Date.now()).slice(-4)}`,
      customer: formData.fullName,
      date: new Date().toISOString().split('T')[0],
      total: cartTotal,
      status: 'قيد المعالجة',
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      address: formData.address,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'
    };

    // عرض رسالة النجاح
    setSuccessDialog({ isOpen: true, orderId: newOrder.id });
    clearCart();
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // مسح الخطأ عند الكتابة
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  return (
    <div className="container">
      <ConfirmDialog
        isOpen={successDialog.isOpen}
        title="تم تأكيد طلبك بنجاح! 🎉"
        message={`رقم طلبك: ${successDialog.orderId}. شكراً لتسوقك من BatTechno! سيتم التواصل معك قريباً.`}
        confirmText="العودة للرئيسية"
        cancelText="تصفح المنتجات"
        variant="success"
        onConfirm={() => navigate('/')}
        onCancel={() => navigate('/products')}
      />

      <div className="checkout-container">
        <h1 className="checkout-title">إتمام الطلب</h1>
        
        {/* ملخص تفصيلي للسلة */}
        <div className="order-summary-detailed">
          <h3>ملخص طلبك</h3>
          <div className="order-items-list">
            {cart.map(item => (
              <div key={item.id} className="order-summary-item">
                <span className="item-name">{item.name} × {item.quantity}</span>
                <span className="item-subtotal">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="order-summary-total">
            <span>الإجمالي:</span>
            <span>${cartTotal}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          {/* حقول العنوان */}
          <h3 className="form-section-title">معلومات التوصيل</h3>
          
          <div className={`form-group ${formErrors.fullName ? 'has-error' : ''}`}>
            <label htmlFor="fullName">الاسم الكامل</label>
            <input 
              id="fullName"
              type="text" 
              className="form-input" 
              placeholder="مثال: مصطفى الطراونة"
              value={formData.fullName}
              onChange={handleChange('fullName')}
            />
            {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
          </div>

          <div className={`form-group ${formErrors.phone ? 'has-error' : ''}`}>
            <label htmlFor="phone">رقم الهاتف</label>
            <input 
              id="phone"
              type="tel" 
              className="form-input" 
              placeholder="07XXXXXXXX"
              value={formData.phone}
              onChange={handleChange('phone')}
            />
            {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
          </div>

          <div className={`form-group ${formErrors.address ? 'has-error' : ''}`}>
            <label htmlFor="address">العنوان بالتفصيل</label>
            <textarea 
              id="address"
              className="form-input" 
              rows="3"
              placeholder="المحافظة، المنطقة، الشارع، رقم العمارة"
              value={formData.address}
              onChange={handleChange('address')}
            ></textarea>
            {formErrors.address && <span className="field-error">{formErrors.address}</span>}
          </div>

          {/* حقول الدفع */}
          <h3 className="form-section-title">طريقة الدفع</h3>

          <div className="payment-methods">
            <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="cod" 
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange('paymentMethod')}
              />
              💵 الدفع عند الاستلام
            </label>
            <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="card" 
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange('paymentMethod')}
              />
              💳 بطاقة ائتمان
            </label>
          </div>

          {formData.paymentMethod === 'card' && (
            <div className="card-fields">
              <div className={`form-group ${formErrors.cardNumber ? 'has-error' : ''}`}>
                <label htmlFor="cardNumber">رقم البطاقة</label>
                <input 
                  id="cardNumber"
                  type="text" 
                  className="form-input" 
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength="19"
                  value={formData.cardNumber}
                  onChange={handleChange('cardNumber')}
                />
                {formErrors.cardNumber && <span className="field-error">{formErrors.cardNumber}</span>}
              </div>
              <div className="card-row">
                <div className={`form-group ${formErrors.cardExpiry ? 'has-error' : ''}`}>
                  <label htmlFor="cardExpiry">تاريخ الانتهاء</label>
                  <input 
                    id="cardExpiry"
                    type="text" 
                    className="form-input" 
                    placeholder="MM/YY"
                    maxLength="5"
                    value={formData.cardExpiry}
                    onChange={handleChange('cardExpiry')}
                  />
                  {formErrors.cardExpiry && <span className="field-error">{formErrors.cardExpiry}</span>}
                </div>
                <div className={`form-group ${formErrors.cardCVV ? 'has-error' : ''}`}>
                  <label htmlFor="cardCVV">CVV</label>
                  <input 
                    id="cardCVV"
                    type="text" 
                    className="form-input" 
                    placeholder="XXX"
                    maxLength="3"
                    value={formData.cardCVV}
                    onChange={handleChange('cardCVV')}
                  />
                  {formErrors.cardCVV && <span className="field-error">{formErrors.cardCVV}</span>}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="submit-order-btn">
            {formData.paymentMethod === 'cod' ? 'تأكيد الطلب والدفع عند الاستلام' : 'تأكيد الطلب والدفع الآن'}
          </button>
        </form>
      </div>
    </div>
  );
}