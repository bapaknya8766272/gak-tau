import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Cart } from '@/components/sections/Cart';
import { Payment } from '@/components/sections/Payment';
import { Contact } from '@/components/sections/Contact';
import { Testimonials } from '@/components/sections/Testimonials';
import { ChatBot } from '@/components/ChatBot';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useCart } from '@/hooks/useCart';
import { useRateLimit, useVisitorTracking, useBotDetection } from '@/hooks/useSecurity';
import type { Product } from '@/types';
import { toast } from 'sonner';
import './App.css';

// Main App Content Component
function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'payment'>('home');
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { checkRateLimit } = useRateLimit();
  const { isBot } = useBotDetection();
  
  // Track visitors
  useVisitorTracking();

  // Bot detection warning
  useEffect(() => {
    if (isBot) {
      console.warn('Bot activity detected');
    }
  }, [isBot]);

  // Handle add to cart with toast notification and rate limiting
  const handleAddToCart = (product: Product) => {
    // Check rate limit
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      toast.error(rateCheck.message);
      return;
    }

    // Check if product is in stock
    if (product.category !== 'other' && (product.stock || 0) <= 0) {
      toast.error('Stok habis!', {
        description: `${product.name} sedang tidak tersedia`,
      });
      return;
    }

    const result = addToCart(product);
    if (result.success) {
      toast.success(result.message, {
        description: `${product.name} ditambahkan ke keranjang`,
      });
    } else {
      toast.error(result.message);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong!');
      return;
    }
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle payment complete
  const handlePaymentComplete = () => {
    clearCart();
    setCurrentView('home');
    toast.success('Pesanan berhasil dibuat!', {
      description: 'Silakan konfirmasi pembayaran via WhatsApp',
    });
  };

  // Handle back from payment
  const handleBackFromPayment = () => {
    setCurrentView('home');
    setTimeout(() => {
      const cartSection = document.getElementById('cart');
      if (cartSection) {
        cartSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Scroll to cart when header cart is clicked
  const handleCartClick = () => {
    if (currentView === 'payment') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const cartSection = document.getElementById('cart');
      if (cartSection) {
        cartSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Scroll to services when CTA is clicked
  const handleCtaClick = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <Header 
        cartCount={totalItems} 
        onCartClick={handleCartClick}
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onCtaClick={handleCtaClick} />
            <Services 
              onAddToCart={handleAddToCart}
              searchQuery=""
            />
            <Testimonials />
            <Cart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
            />
            <Contact />
          </motion.main>
        ) : (
          <motion.main
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Payment
              items={cart}
              totalPrice={totalPrice}
              onBack={handleBackFromPayment}
              onComplete={handlePaymentComplete}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      {currentView === 'home' && <Footer />}

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

// Admin Route
function AdminRoute() {
  return <AdminDashboard />;
}

// Main App with Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
