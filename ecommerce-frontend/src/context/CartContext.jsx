import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // دالة إضافة منتج للسلة (معدلة ومحسنة)
  const addToCart = (product) => {
    // 1. نفحص السلة الحالية قبل ما نعمل أي تعديل
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      // 2. إذا المنتج موجود، بنشيك على المخزون أول
      if (existingItem.quantity >= product.stockQuantity) {
        alert('لا يمكنك تجاوز الكمية المتوفرة في المخزون!');
        return; // بنوقف التنفيذ هون
      }
      
      // 3. إذا أموره تمام، بنزيد الكمية
      setCart(prevCart => prevCart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      alert('تمت زيادة كمية المنتج في السلة!');
      
    } else {
      // 4. إذا المنتج جديد كلياً
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
      alert('تمت إضافة المنتج للسلة بنجاح!');
    }
  };

  const updateQuantity = (id, newQuantity, stockQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > stockQuantity) {
      alert('عذراً، الكمية المطلوبة غير متوفرة بالمخزون!');
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeFromCart = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا المنتج من السلة؟')) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);