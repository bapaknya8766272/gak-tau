import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Contact() {
  const contacts = [
    {
      icon: MapPin,
      label: 'Alamat',
      value: 'Jawa Tengah, Blora, Randublatung',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: '+62 822-2676-9163',
      href: 'https://wa.me/6282226769163',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'sanzbot938@gmail.com',
      href: 'mailto:sanzbot938@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      label: 'Jam Operasional',
      value: '24/7 Online Support',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="contact" className="py-24 relative">
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
            <MessageCircle className="w-3 h-3 mr-1" />
            Hubungi Kami
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Siap <span className="gradient-text">Membantu</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {contact.href ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card-hover p-5 flex items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-slate-400">{contact.label}</p>
                      <p className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {contact.value}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <div className="glass-card p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center flex-shrink-0`}>
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{contact.label}</p>
                      <p className="text-lg font-semibold text-white">{contact.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="flex-1 btn-primary-gradient py-6"
                onClick={() => window.open('https://wa.me/6282226769163', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-2 h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1234567890123!2d111.3!3d-7.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDYnMDAuMCJTIDExMcKwMTgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px', minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi ALFA Hosting"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
