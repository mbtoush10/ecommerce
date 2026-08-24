import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'تأكيد', cancelText = 'إلغاء', variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon ${variant}`}>
          {variant === 'danger' ? '⚠️' : variant === 'success' ? '✅' : 'ℹ️'}
        </div>
        <h3 id="confirm-title" className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>{cancelText}</button>
          <button className={`confirm-btn ${variant}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
