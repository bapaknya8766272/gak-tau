import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  QrCode, 
  Wallet, 
  Smartphone,
  Check,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Loader2,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { CartItem, SaleRecord } from '@/types';
import { generatePakasirUrl, openWhatsApp } from '@/services/pakasir';
import { getProducts, saveProducts } from '@/data/products';
import { toast } from 'sonner';

interface PaymentProps {
  items: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onComplete: () => void;
}

export function Payment({ items, totalPrice, onBack, onComplete }: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPakasirDialog, setShowPakasirDialog] = useState(false);
  const [showQRISDialog, setShowQRISDialog] = useState(false);
  const [showEWalletDialog, setShowEWalletDialog] = useState(false);
  const [selectedEWallet, setSelectedEWallet] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Generate Order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ALFA-${timestamp}-${random}`;
  };

  // Save sale to history and reduce stock
  const processOrder = (orderId: string) => {
    // Get current products
    const products = getProducts();
    
    // Reduce stock for each item
    items.forEach(item => {
      const productIndex = products.findIndex(p => p.name === item.service);
      if (productIndex !== -1 && products[productIndex].category !== 'other') {
        const currentStock = products[productIndex].stock || 0;
        products[productIndex].stock = Math.max(0, currentStock - item.quantity);
      }
    });
    
    // Save updated products
    saveProducts(products);
    
    // Save to sales history
    const salesHistory: SaleRecord[] = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    items.forEach(item => {
      salesHistory.push({
        service: item.service,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        date: new Date().toLocaleDateString('id-ID'),
        timestamp: Date.now()
      });
    });
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    
    toast.success('Pesanan berhasil diproses! Stok telah dikurangi.');
    return orderId;
  };

  // Handle Pakasir Payment (URL Method)
  const handlePakasirPayment = () => {
    if (!customerData.name || !customerData.phone) {
      toast.error('Nama dan nomor WhatsApp wajib diisi!');
      return;
    }

    setIsProcessing(true);
    
    const orderId = generateOrderId();
    
    // Process order (reduce stock, save history)
    processOrder(orderId);
    
    // Generate Pakasir URL
    const pakasirUrl = generatePakasirUrl(totalPrice, orderId, {
      redirectUrl: window.location.origin,
    });
    
    setIsProcessing(false);
    
    // Open Pakasir payment page
    window.open(pakasirUrl, '_blank');
    
    // Also open WhatsApp for confirmation
    setTimeout(() => {
      openWhatsApp('6282226769163', items, totalPrice, orderId);
      onComplete();
    }, 1000);
  };

  // Handle Pakasir QRIS Only
  const handlePakasirQRIS = () => {
    if (!customerData.name || !customerData.phone) {
      toast.error('Nama dan nomor WhatsApp wajib diisi!');
      return;
    }

    setIsProcessing(true);
    
    const orderId = generateOrderId();
    
    // Process order
    processOrder(orderId);
    
    // Generate Pakasir URL with QRIS only
    const pakasirUrl = generatePakasirUrl(totalPrice, orderId, {
      redirectUrl: window.location.origin,
      qrisOnly: true,
    });
    
    setIsProcessing(false);
    
    // Open Pakasir payment page
    window.open(pakasirUrl, '_blank');
    
    // Also open WhatsApp for confirmation
    setTimeout(() => {
      openWhatsApp('6282226769163', items, totalPrice, orderId);
      onComplete();
    }, 1000);
  };

  // Handle Manual E-Wallet Payment
  const handleEWalletPayment = () => {
    const orderId = generateOrderId();
    processOrder(orderId);
    openWhatsApp('6282226769163', items, totalPrice, orderId);
    onComplete();
  };

  // Copy nomor e-wallet
  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(true);
    toast.success('Nomor disalin!');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const paymentMethods = [
    {
      id: 'pakasir',
      name: 'Pakasir Payment',
      description: 'QRIS, VA, & E-Wallet otomatis',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      recommended: true
    },
    {
      id: 'pakasir-qris',
      name: 'Pakasir QRIS Only',
      description: 'Hanya QRIS (tanpa pilihan lain)',
      icon: QrCode,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'dana',
      name: 'DANA',
      description: '0822-2676-9163 (Manual)',
      icon: Wallet,
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      description: '0822-2676-9163 (Manual)',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-400'
    },
    {
      id: 'ovo',
      name: 'OVO',
      description: '0822-2676-9163 (Manual)',
      icon: Wallet,
      color: 'from-purple-600 to-purple-400'
    }
  ];

  if (items.length === 0) {
    return (
      <section className="py-24 relative min-h-screen">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Tidak ada item untuk dibayar
            </h2>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-slate-400 hover:text-white"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Keranjang
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            <CreditCard className="w-3 h-3 mr-1" />
            Pembayaran
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pilih Metode <span className="gradient-text">Pembayaran</span>
          </h2>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Ringkasan Pesanan
          </h3>
          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-400">
                  {item.service} x{item.quantity}
                </span>
                <span className="text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="text-2xl font-bold gradient-text">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4"
        >
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                if (method.id === 'pakasir') {
                  setShowPakasirDialog(true);
                } else if (method.id === 'pakasir-qris') {
                  setShowQRISDialog(true);
                } else {
                  setSelectedEWallet(method.id);
                  setShowEWalletDialog(true);
                }
              }}
              className={`glass-card p-4 flex items-center gap-4 text-left transition-all ${
                selectedMethod === method.id 
                  ? 'ring-2 ring-blue-500 bg-white/10' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{method.name}</span>
                  {method.recommended && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400">{method.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-white/20'
              }`}>
                {selectedMethod === method.id && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          Stok akan otomatis berkurang setelah konfirmasi pembayaran.
        </motion.p>
      </div>

      {/* Pakasir Payment Dialog */}
      <Dialog open={showPakasirDialog} onOpenChange={setShowPakasirDialog}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Pembayaran via Pakasir
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Masukkan data Anda untuk melanjutkan ke halaman pembayaran Pakasir
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Masukkan nama Anda"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Nomor WhatsApp *</Label>
              <Input
                id="phone"
                placeholder="Contoh: 08123456789"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Total Pembayaran</span>
                <span className="text-xl font-bold gradient-text">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Anda akan diarahkan ke halaman pembayaran Pakasir
              </p>
            </div>

            <Button
              className="w-full btn-primary-gradient"
              onClick={handlePakasirPayment}
              disabled={!customerData.name || !customerData.phone || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lanjutkan ke Pakasir
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QRIS Only Dialog */}
      <Dialog open={showQRISDialog} onOpenChange={setShowQRISDialog}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-400" />
              Pembayaran QRIS Only
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Anda akan langsung melihat QRIS tanpa pilihan metode lain
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="qris-name">Nama Lengkap *</Label>
              <Input
                id="qris-name"
                placeholder="Masukkan nama Anda"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="qris-phone">Nomor WhatsApp *</Label>
              <Input
                id="qris-phone"
                placeholder="Contoh: 08123456789"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Total Pembayaran</span>
                <span className="text-xl font-bold gradient-text">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <Button
              className="w-full btn-primary-gradient"
              onClick={handlePakasirQRIS}
              disabled={!customerData.name || !customerData.phone || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Bayar dengan QRIS
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* E-Wallet Manual Dialog */}
      <Dialog open={showEWalletDialog} onOpenChange={setShowEWalletDialog}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              Pembayaran Manual {selectedEWallet?.toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Transfer manual ke nomor berikut
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-4">
            <div className="bg-white/5 rounded-xl p-6 mb-4">
              <p className="text-slate-400 mb-2">Nomor {selectedEWallet?.toUpperCase()}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-white">0822-2676-9163</span>
                <button
                  onClick={() => copyNumber('082226769163')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {copiedNumber ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-2xl font-bold gradient-text mb-4">
              {formatPrice(totalPrice)}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-400">
                Setelah transfer, klik tombol di bawah untuk konfirmasi via WhatsApp
              </p>
            </div>

            <Button
              className="w-full btn-primary-gradient"
              onClick={handleEWalletPayment}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Konfirmasi via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
