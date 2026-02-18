export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  verified: boolean;
}

export const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmad Rizky',
    rating: 5,
    comment: 'VPS-nya kencang banget! Udah 3 bulan pakai, ga pernah ada masalah. Supportnya juga cepat respon.',
    product: 'STANDARD VPS 4GB',
    date: '2026-02-10',
    verified: true
  },
  {
    id: '2',
    name: 'Dewi Sartika',
    rating: 5,
    comment: 'Panel Pterodactyl-nya murah dan stabil. Bot WhatsApp saya jalan terus 24/7 tanpa kendala.',
    product: 'PANEL UNLIMITED',
    date: '2026-02-08',
    verified: true
  },
  {
    id: '3',
    name: 'Budi Santoso',
    rating: 5,
    comment: 'Jasa install panelnya rapi dan cepat. Langsung bisa dipakai buat jualan panel. Recommended!',
    product: 'JASA INSTALL PANEL',
    date: '2026-02-05',
    verified: true
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    rating: 4,
    comment: 'Pembuatan website-nya bagus dan sesuai request. Harganya juga terjangkau.',
    product: 'PEMBUATAN WEBSITE',
    date: '2026-02-01',
    verified: true
  },
  {
    id: '5',
    name: 'Rudi Hartono',
    rating: 5,
    comment: 'Reseller panel-nya worth it! Balik modal dalam seminggu. Adminnya juga baik dan sabar ngajarin.',
    product: 'RESELLER PANEL',
    date: '2026-01-28',
    verified: true
  },
  {
    id: '6',
    name: 'Maya Angelina',
    rating: 5,
    comment: 'Pembayaran pakai QRIS mudah dan cepat. Prosesnya ga sampe 5 menit udah aktif.',
    product: 'PANEL TURBO 8GB',
    date: '2026-01-25',
    verified: true
  }
];

export const getTestimonials = (): Testimonial[] => {
  const stored = localStorage.getItem('testimonials');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
  return defaultTestimonials;
};

export const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'>): Testimonial => {
  const testimonials = getTestimonials();
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    verified: false // Need admin approval
  };
  testimonials.unshift(newTestimonial);
  localStorage.setItem('testimonials', JSON.stringify(testimonials));
  return newTestimonial;
};

export const approveTestimonial = (id: string) => {
  const testimonials = getTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  if (index !== -1) {
    testimonials[index].verified = true;
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }
};

export const deleteTestimonial = (id: string) => {
  const testimonials = getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  localStorage.setItem('testimonials', JSON.stringify(filtered));
};
