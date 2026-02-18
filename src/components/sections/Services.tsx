import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  LayoutGrid, 
  Wrench, 
  ShoppingCart, 
  Info,
  Star,
  Check,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Product } from '@/types';
import { getProducts } from '@/data/products';

interface ServicesProps {
  onAddToCart: (product: Product) => void;
  searchQuery: string;
}

export function Services({ onAddToCart, searchQuery }: ServicesProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  
  const products = getProducts();

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setAddedProducts(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const categories = [
    { id: 'vps', name: 'VPS Cloud', icon: Server, color: 'from-blue-500 to-cyan-400' },
    { id: 'panel', name: 'Panel Pterodactyl', icon: LayoutGrid, color: 'from-purple-500 to-pink-400' },
    { id: 'other', name: 'Jasa & Addons', icon: Wrench, color: 'from-green-500 to-emerald-400' },
  ] as const;

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.desc.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const getProductsByCategory = (category: string) => {
    return filteredProducts.filter(p => p.category === category);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="services" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            <Zap className="w-3 h-3 mr-1" />
            Layanan Kami
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Pilih Layanan <span className="gradient-text">Terbaik</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Berbagai pilihan VPS, Panel, dan Jasa IT dengan harga terjangkau dan kualitas terbaik.
          </p>
        </motion.div>

        {/* Categories */}
        {categories.map((category, catIndex) => {
          const categoryProducts = getProductsByCategory(category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className={`glass-card-hover p-5 h-full flex flex-col relative group ${
                      product.recommend ? 'ring-2 ring-yellow-500/50' : ''
                    }`}>
                      {/* Stock Badge */}
                      {product.category !== 'other' && (
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          (product.stock || 0) > 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {(product.stock || 0) > 0 ? `Stok: ${product.stock}` : 'Habis'}
                        </div>
                      )}

                      {/* Best Seller Badge */}
                      {product.recommend && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          BEST SELLER
                        </div>
                      )}

                      {/* Product Name */}
                      <h4 className="text-lg font-bold text-white mb-2 pr-16">
                        {product.name}
                      </h4>

                      {/* Price */}
                      <div className="text-2xl font-bold gradient-text mb-3">
                        {formatPrice(product.price)}
                      </div>

                      {/* Short Description */}
                      <p className="text-sm text-slate-400 mb-4 flex-grow line-clamp-2">
                        {product.desc.split('\n')[0].replace(/^[✅🔹👑💼🏢🤝🛠️📜🔧✏️🌐🔥🚀✨]/, '')}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white/20 text-slate-300 hover:bg-white/10"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Info className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 ${
                            addedProducts.has(product.id)
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'btn-primary-gradient'
                          }`}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.category !== 'other' && (product.stock || 0) <= 0}
                        >
                          {addedProducts.has(product.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              OK
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Beli
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Detail lengkap produk
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="mt-4">
              <div className="text-3xl font-bold gradient-text mb-4">
                {formatPrice(selectedProduct.price)}
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                  {selectedProduct.desc}
                </pre>
              </div>

              {selectedProduct.category !== 'other' && (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  (selectedProduct.stock || 0) > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    (selectedProduct.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  Stok: {(selectedProduct.stock || 0) > 0 ? selectedProduct.stock : 'Habis'}
                </div>
              )}

              <Button
                className="w-full mt-4 btn-primary-gradient"
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.category !== 'other' && (selectedProduct.stock || 0) <= 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {(selectedProduct.stock || 0) > 0 || selectedProduct.category === 'other'
                  ? 'Tambah ke Keranjang'
                  : 'Stok Habis'
                }
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
