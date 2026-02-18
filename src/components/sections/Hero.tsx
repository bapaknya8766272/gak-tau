import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Zap, 
  Shield, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    { icon: Zap, text: 'Aktivasi Instan' },
    { icon: Shield, text: 'Garansi Uptime 99%' },
    { icon: Server, text: 'Support 24/7' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient animate-gradient-shift" />
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-slate-300">Server Online 100% Uptime</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">Solusi Hosting</span>
          <br />
          <span className="gradient-text">Cepat & Terpercaya</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          VPS Kencang, Panel Murah, dan Jasa IT Profesional. 
          Garansi Uptime & Support Cepat 24/7.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari layanan (misal: VPS 4GB, Panel Unlimited...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <Server className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary-gradient"
              onClick={() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Cari
            </Button>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="btn-primary-gradient text-lg px-8 py-6"
            onClick={onCtaClick}
          >
            Lihat Layanan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6"
            onClick={() => window.open('https://wa.me/6282226769163', '_blank')}
          >
            Chat Admin
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <feature.icon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
        >
          {[
            { value: '500+', label: 'Pelanggan' },
            { value: '99%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
            { value: '4.9', label: 'Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
