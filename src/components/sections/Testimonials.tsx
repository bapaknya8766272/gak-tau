import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2,
  Send,
  User
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTestimonials, addTestimonial } from '@/data/testimonials';
import { toast } from 'sonner';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState(getTestimonials());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    product: ''
  });

  const verifiedTestimonials = testimonials.filter(t => t.verified);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.comment || !formData.product) {
      toast.error('Semua field harus diisi!');
      return;
    }

    addTestimonial({
      name: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      product: formData.product
    });

    toast.success('Testimoni berhasil dikirim!', {
      description: 'Testimoni Anda akan ditampilkan setelah disetujui admin.'
    });

    setFormData({ name: '', rating: 5, comment: '', product: '' });
    setIsDialogOpen(false);
    setTestimonials(getTestimonials());
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400">
            <MessageSquare className="w-3 h-3 mr-1" />
            Testimoni
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Apa Kata <span className="gradient-text">Pelanggan</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Lihat pengalaman pelanggan yang sudah menggunakan layanan kami.
          </p>
        </motion.div>

        {/* Add Testimonial Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => setIsDialogOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Bagikan Pengalaman Anda
          </Button>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{testimonial.date}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Comment */}
              <p className="text-slate-300 text-sm mb-4 line-clamp-4">
                "{testimonial.comment}"
              </p>

              {/* Product */}
              <Badge variant="outline" className="border-white/20 text-slate-400 text-xs">
                {testimonial.product}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '500+', label: 'Pelanggan Puas' },
            { value: '4.9', label: 'Rating Rata-rata' },
            { value: '99%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Add Testimonial Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bagikan Pengalaman Anda</DialogTitle>
            <DialogDescription className="text-slate-400">
              Ceritakan pengalaman Anda menggunakan layanan kami.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Nama</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                className="bg-white/5 border-white/10 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label>Produk yang Dibeli</Label>
              <Input
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="Contoh: VPS 4GB, Panel Unlimited"
                className="bg-white/5 border-white/10 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Testimoni</Label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Ceritakan pengalaman Anda..."
                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white mt-1 min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-primary-gradient"
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
