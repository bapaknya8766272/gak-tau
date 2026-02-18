import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Shield,
  AlertTriangle,
  Minus,
  Plus as PlusIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product, SaleRecord } from '@/types';
import { defaultProducts, getProducts, saveProducts } from '@/data/products';
import { getTestimonials, approveTestimonial, deleteTestimonial, type Testimonial } from '@/data/testimonials';
import { toast } from 'sonner';

// Admin password hash (SHA256 of "admin123")
const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

type Tab = 'products' | 'orders' | 'testimonials' | 'security';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('products');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [visits, setVisits] = useState(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  // Stats
  const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = salesHistory.length;
  const bestSeller = salesHistory.length > 0 
    ? Object.entries(
        salesHistory.reduce((acc, sale) => {
          acc[sale.service] = (acc[sale.service] || 0) + sale.quantity;
          return acc;
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
    : '-';

  // Load data
  useEffect(() => {
    setProducts(getProducts());
    const storedSales = localStorage.getItem('salesHistory');
    if (storedSales) {
      setSalesHistory(JSON.parse(storedSales));
    }
    const storedVisits = localStorage.getItem('total_visits');
    if (storedVisits) {
      setVisits(parseInt(storedVisits));
    }
    setTestimonials(getTestimonials());
    
    const suspicious = localStorage.getItem('suspicious_activity');
    if (suspicious === 'true') {
      setSuspiciousActivity(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!password) {
      setLoginError('Password tidak boleh kosong!');
      return;
    }
    
    const hash = await sha256(password);
    if (hash === ADMIN_HASH) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
      toast.success('Login berhasil! Selamat datang di Admin Dashboard.');
    } else {
      setLoginError('Password salah!');
      toast.error('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
    toast.success('Logout berhasil!');
  };

  // Quick stock update
  const handleUpdateStock = (productId: string, delta: number) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      const currentStock = products[index].stock || 0;
      const newStock = Math.max(0, currentStock + delta);
      products[index].stock = newStock;
      saveProducts(products);
      setProducts([...products]);
      toast.success(`Stok ${products[index].name} diupdate: ${newStock}`);
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      const updated = products.map(p => p.id === product.id ? product : p);
      setProducts(updated);
      saveProducts(updated);
      toast.success('Produk berhasil diupdate!');
    } else {
      const newProduct = { ...product, id: Date.now().toString() };
      const updated = [...products, newProduct];
      setProducts(updated);
      saveProducts(updated);
      toast.success('Produk berhasil ditambahkan!');
    }
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
      toast.success('Produk berhasil dihapus!');
    }
  };

  const handleResetProducts = () => {
    if (confirm('Yakin ingin reset ke data default? Semua perubahan akan hilang.')) {
      saveProducts(defaultProducts);
      setProducts(defaultProducts);
      toast.success('Produk direset ke default!');
    }
  };

  const handleClearHistory = () => {
    if (confirm('Yakin ingin menghapus semua riwayat penjualan?')) {
      localStorage.removeItem('salesHistory');
      setSalesHistory([]);
      toast.success('Riwayat penjualan dihapus!');
    }
  };

  const handleApproveTestimonial = (id: string) => {
    approveTestimonial(id);
    setTestimonials(getTestimonials());
    toast.success('Testimoni disetujui!');
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Yakin ingin menghapus testimoni ini?')) {
      deleteTestimonial(id);
      setTestimonials(getTestimonials());
      toast.success('Testimoni dihapus!');
    }
  };

  const handleClearSuspicious = () => {
    localStorage.removeItem('suspicious_activity');
    setSuspiciousActivity(false);
    toast.success('Status keamanan direset!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-slate-400">Masukkan password untuk melanjutkan</p>
            <p className="text-xs text-slate-500 mt-2">Default: admin123</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-white/5 border-white/10 text-white pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}

            <Button
              className="w-full btn-primary-gradient"
              onClick={handleLogin}
            >
              Masuk
            </Button>

            <Button
              variant="ghost"
              className="w-full text-slate-400"
              onClick={() => window.location.href = '/'}
            >
              Kembali ke Website
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Lihat Website
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: DollarSign, 
              label: 'Total Pendapatan', 
              value: formatPrice(totalRevenue),
              color: 'from-green-500 to-emerald-500'
            },
            { 
              icon: Users, 
              label: 'Pengunjung', 
              value: visits.toString(),
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: ShoppingCart, 
              label: 'Total Transaksi', 
              value: totalOrders.toString(),
              color: 'from-purple-500 to-pink-500'
            },
            { 
              icon: TrendingUp, 
              label: 'Produk Terlaris', 
              value: bestSeller,
              color: 'from-yellow-500 to-orange-500'
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Alert */}
        {suspiciousActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border-red-500/30 p-4 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-white font-semibold">Aktivitas Mencurigakan Terdeteksi!</p>
                <p className="text-slate-400 text-sm">Terlalu banyak request dari pengunjung dalam waktu singkat.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSuspicious}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Reset Alert
            </Button>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'products', label: 'Produk', icon: Package },
            { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
            { id: 'testimonials', label: 'Testimoni', icon: MessageSquare },
            { id: 'security', label: 'Keamanan', icon: Shield },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={activeTab === tab.id ? 'btn-primary-gradient' : 'border-white/20 text-slate-400'}
              onClick={() => setActiveTab(tab.id as Tab)}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Manajemen Produk & Stok</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetProducts}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="btn-primary-gradient"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400">Produk</TableHead>
                    <TableHead className="text-slate-400">Kategori</TableHead>
                    <TableHead className="text-slate-400">Harga</TableHead>
                    <TableHead className="text-slate-400">Stok</TableHead>
                    <TableHead className="text-slate-400">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="border-white/10">
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          {product.name}
                          {product.recommend && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                              ★
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/20 text-slate-400">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        {product.category === 'other' ? (
                          <span className="text-slate-500">-</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStock(product.id, -1)}
                              className="w-6 h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`w-8 text-center font-mono ${product.stock === 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {product.stock || 0}
                            </span>
                            <button
                              onClick={() => handleUpdateStock(product.id, 1)}
                              className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                            {product.stock === 0 && (
                              <Badge className="bg-red-500/20 text-red-400 text-xs ml-2">Habis</Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Riwayat Penjualan</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Riwayat
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400">Tanggal</TableHead>
                    <TableHead className="text-slate-400">Produk</TableHead>
                    <TableHead className="text-slate-400">Jumlah</TableHead>
                    <TableHead className="text-slate-400">Total</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        Belum ada riwayat penjualan
                      </TableCell>
                    </TableRow>
                  ) : (
                    [...salesHistory].reverse().map((sale, index) => (
                      <TableRow key={index} className="border-white/10">
                        <TableCell className="text-slate-400">{sale.date}</TableCell>
                        <TableCell className="text-white">{sale.service}</TableCell>
                        <TableCell className="text-slate-400">x{sale.quantity}</TableCell>
                        <TableCell className="text-white">{formatPrice(sale.total)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400">
                            Lunas
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Manajemen Testimoni</h2>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400">
                {testimonials.filter(t => !t.verified).length} Pending
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400">Nama</TableHead>
                    <TableHead className="text-slate-400">Produk</TableHead>
                    <TableHead className="text-slate-400">Rating</TableHead>
                    <TableHead className="text-slate-400">Testimoni</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        Belum ada testimoni
                      </TableCell>
                    </TableRow>
                  ) : (
                    testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id} className="border-white/10">
                        <TableCell className="text-white">{testimonial.name}</TableCell>
                        <TableCell className="text-slate-400">{testimonial.product}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={i < testimonial.rating ? 'text-yellow-400' : 'text-slate-600'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300 max-w-xs truncate">
                          {testimonial.comment}
                        </TableCell>
                        <TableCell>
                          {testimonial.verified ? (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!testimonial.verified && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => handleApproveTestimonial(testimonial.id)}
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Rate Limiting Info */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Proteksi Rate Limiting</h2>
              </div>
              <div className="space-y-3 text-slate-400">
                <p>Website ini dilengkapi dengan proteksi otomatis:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maksimal 10 request per menit per pengguna</li>
                  <li>Blokir otomatis selama 5 menit jika melebihi limit</li>
                  <li>Deteksi aktivitas mencurigakan (bot/spam)</li>
                  <li>Validasi form dengan honeypot field</li>
                  <li>Proteksi XSS dan Clickjacking</li>
                </ul>
              </div>
            </div>

            {/* Visitor Stats */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Statistik Pengunjung</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Total Pengunjung</p>
                  <p className="text-2xl font-bold text-white">{visits}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Status Keamanan</p>
                  <p className={`text-lg font-bold ${suspiciousActivity ? 'text-red-400' : 'text-green-400'}`}>
                    {suspiciousActivity ? 'Waspada' : 'Aman'}
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Data */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-semibold text-white">Zona Berbahaya</h2>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('Yakin ingin menghapus SEMUA data?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Semua Data
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Product Edit Dialog */}
      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

// Product Dialog Component
interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'vps',
    price: 0,
    stock: 10,
    desc: '',
    recommend: false,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        category: 'vps',
        price: 0,
        stock: 10,
        desc: '',
        recommend: false,
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {product ? 'Ubah detail produk' : 'Tambah produk baru'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Nama Produk</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label>Kategori</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white mt-1"
            >
              <option value="vps">VPS</option>
              <option value="panel">Panel</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Harga (Rp)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="bg-white/5 border-white/10 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label>Stok</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="bg-white/5 border-white/10 text-white mt-1"
                disabled={formData.category === 'other'}
              />
            </div>
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white mt-1 min-h-[100px]"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recommend"
              checked={formData.recommend}
              onChange={(e) => setFormData({ ...formData, recommend: e.target.checked })}
              className="rounded bg-white/5 border-white/10"
            />
            <Label htmlFor="recommend" className="mb-0">Tandai sebagai Best Seller</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary-gradient"
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
