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

  // دالة إضافة منتج للسلة مع دعم الكمية المحددة
  const addToCart = (product, quantityToAdd = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQty + quantityToAdd;

    if (newTotalQty > product.stockQuantity) {
      return { 
        success: false, 
        message: `لا يمكنك تجاوز الكمية المتوفرة بالمخزون! المتبقي: ${product.stockQuantity - currentQty}` 
      };
    }

    if (existingItem) {
      setCart(prevCart => prevCart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
      ));
      return { success: true, message: `تمت إضافة ${quantityToAdd} قطعة إلى السلة بنجاح!` };
    } else {
      setCart(prevCart => [...prevCart, { ...product, quantity: quantityToAdd }]);
      return { success: true, message: 'تمت إضافة المنتج للسلة بنجاح!' };
    }
  };

  const updateQuantity = (id, newQuantity, stockQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > stockQuantity) {
      return { success: false, message: 'عذراً، الكمية المطلوبة غير متوفرة بالمخزون!' };
    }
    setCart(prevCart => 
      prevCart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
    return { success: true };
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
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