import { Server, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    layanan: [
      { label: 'VPS Cloud', href: '#services' },
      { label: 'Panel Pterodactyl', href: '#services' },
      { label: 'Jasa IT', href: '#services' },
    ],
    support: [
      { label: 'WhatsApp', href: 'https://wa.me/6282226769163' },
      { label: 'Email', href: 'mailto:sanzbot938@gmail.com' },
      { label: 'Dokumentasi', href: '#' },
    ],
    legal: [
      { label: 'Syarat & Ketentuan', href: '#' },
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Login Admin', href: '/admin' },
    ]
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a 
              href="#"
              className="flex items-center gap-2 mb-4"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                ALFA Hosting
              </span>
            </a>
            <p className="text-slate-400 text-sm mb-6">
              Solusi hosting terpercaya untuk bisnis Anda. VPS kencang, panel murah, dan jasa IT profesional.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>di Indonesia</span>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-white font-semibold mb-4">Layanan</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} ALFA Hosting. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/6282226769163"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-green-400 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:sanzbot938@gmail.com"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
