import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/cart', {
        productId,
        quantity
      }, config);
      
      setCart(data);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/cart/${productId}`, config);
      
      // Check if cart is empty after removal
      if (data.items && data.items.length === 0) {
        setCart(null); // Set to null to show empty cart message
        toast.success('Item removed from cart');
      } else {
        setCart(data);
        toast.success('Item removed from cart');
      }
      
      // Force re-fetch to ensure UI is in sync
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      fetchCart,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
