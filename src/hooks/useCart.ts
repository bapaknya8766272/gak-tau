import { useState, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((product: Product) => {
    if (product.category !== 'other' && (product.stock || 0) <= 0) {
      return { success: false, message: 'Stok habis!' };
    }

    setCart(prev => {
      const existing = prev.find(item => item.service === product.name);
      
      if (existing) {
        if (product.category !== 'other') {
          const currentQty = existing.quantity;
          if (currentQty >= (product.stock || 0)) {
            return prev;
          }
        }
        return prev.map(item =>
          item.service === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, {
        service: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      }];
    });
    
    return { success: true, message: 'Ditambahkan ke keranjang!' };
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
}
