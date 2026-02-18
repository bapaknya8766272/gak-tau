import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Package,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <section id="cart" className="py-24 relative">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Keranjang
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Keranjang <span className="gradient-text">Belanja</span>
            </h2>
            
            <div className="glass-card p-12 max-w-md mx-auto mt-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-slate-400 mb-6">
                Belum ada item di keranjang. Yuk, pilih layanan yang Anda butuhkan!
              </p>
              <Button
                className="btn-primary-gradient"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Lihat Layanan
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="cart" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            <ShoppingCart className="w-3 h-3 mr-1" />
            Keranjang
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Keranjang <span className="gradient-text">Belanja</span>
          </h2>
          <p className="text-slate-400">
            {totalItems} item dalam keranjang
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="glass-card-hover p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-cyan-400" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-white truncate">
                    {item.service}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {formatPrice(item.price)} / item
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="font-semibold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>

                <button
                  onClick={() => onRemove(index)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-6">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pajak</span>
                  <span>Termasuk</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold gradient-text">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full btn-primary-gradient py-6"
                onClick={onCheckout}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Lanjutkan ke Pembayaran
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
