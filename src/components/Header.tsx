import { useState, useEffect } from 'react';
import { Server, ShoppingCart, Menu, Moon, Sun, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Layanan' },
    { href: '#cart', label: 'Keranjang', badge: cartCount },
    { href: '#contact', label: 'Kontak' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#cart') {
      onCartClick();
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              ALFA Hosting
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
                {link.badge ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative lg:hidden"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="hidden sm:flex"
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-slate-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </Button>

            {/* CTA Button */}
            <Button
              className="hidden sm:flex btn-primary-gradient"
              onClick={() => window.open('https://wa.me/6282226769163', '_blank')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Kami
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-slate-950 border-l border-white/10">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">
                      ALFA Hosting
                    </span>
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => scrollToSection(link.href)}
                        className="flex items-center justify-between px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <span>{link.label}</span>
                        {link.badge ? (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {link.badge}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </nav>

                  <Button
                    className="btn-primary-gradient w-full mt-4"
                    onClick={() => window.open('https://wa.me/6282226769163', '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi Kami
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
