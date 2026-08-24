import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockOrders } from '../data/orders';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Toast from '../components/common/Toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // نموذج تغيير كلمة المرور (Page 11 بالـ PDF)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setToast({ isVisible: true, message: 'تم حفظ البيانات الشخصية محلياً بنجاح!', type: 'success' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      setPasswordError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل!');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين!');
      return;
    }
    setPasswordError('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ isVisible: true, message: 'تم تحديث كلمة المرور بنجاح!', type: 'success' });
  };

  const userOrders = mockOrders;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟"
        confirmText="تسجيل الخروج"
        cancelText="البقاء"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <h1 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>حسابي الشخصي</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* العمود الأيسر: تعديل البيانات وتغيير الباسورد */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* قسم تعديل البيانات */}
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '24px', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>البيانات الشخصية</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label htmlFor="profile-name" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '5px' }}>الاسم الكامل</label>
                <input id="profile-name" type="text" defaultValue={user?.fullName} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} required />
              </div>
              
              <div>
                <label htmlFor="profile-email" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '5px' }}>البريد الإلكتروني</label>
                <input id="profile-email" type="email" value={user?.email} disabled style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
              </div>
              
              <button type="submit" className="cta-button" style={{ border: 'none', width: '100%' }}>حفظ التعديلات</button>
            </form>
          </div>

          {/* قسم تغيير كلمة المرور (Page 11) */}
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '24px', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>🔒 تغيير كلمة المرور</h3>
            {passwordError && (
              <div style={{ background: '#fee2e2', color: '#991c1c', padding: '10px', borderRadius: '5px', fontSize: '13px', marginBottom: '12px' }}>
                {passwordError}
              </div>
            )}
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>كلمة المرور الحالية</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>تأكيد كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>

              <button type="submit" className="cta-button" style={{ border: 'none', background: 'var(--primary-color)', color: 'white', marginTop: '5px' }}>
                تحديث كلمة المرور
              </button>
            </form>
          </div>

          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            تسجيل الخروج
          </button>
        </div>

        {/* العمود الأيمن: قسم الطلبات السابقة */}
        <div style={{ flex: 2, minWidth: '320px', backgroundColor: 'var(--surface-color)', padding: '24px', borderRadius: '8px', boxShadow: 'var(--card-shadow)', height: 'fit-content' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>📦 طلباتي السابقة ({userOrders.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>رقم الطلب</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>التاريخ</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>الإجمالي</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 10px' }}><strong>{order.id}</strong></td>
                    <td style={{ padding: '12px 10px' }}>{order.date}</td>
                    <td style={{ padding: '12px 10px' }}>${order.total}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ 
                        color: order.status === 'ملغي' ? 'var(--error-color)' : order.status === 'مكتمل' ? 'var(--success-color)' : 'var(--warning-color)', 
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}