import type { Product } from '@/types';

export const defaultProducts: Product[] = [
  // === VPS CLOUD ===
  { 
    id: 'vps1', 
    category: 'vps', 
    name: 'BASIC VPS 1', 
    price: 15000, 
    stock: 10,
    desc: "✅ RAM: 1GB Dedicated\n✅ CPU: 1 Core High Performance\n✅ Storage: 20GB NVMe SSD\n✅ Bandwidth: 1TB\n✅ OS: Linux (Ubuntu/Debian/CentOS)\n🚀 Cocok untuk: Tunneling, Bot Ringan." 
  },
  { 
    id: 'vps2', 
    category: 'vps', 
    name: 'BASIC VPS 2', 
    price: 25000, 
    stock: 15,
    desc: "✅ RAM: 2GB Dedicated\n✅ CPU: 1 Core High Performance\n✅ Storage: 50GB NVMe SSD\n✅ Bandwidth: 2TB\n✅ Akses Root Full Control\n🚀 Cocok untuk: Hosting Web Kecil, VPN Pribadi." 
  },
  { 
    id: 'vps3', 
    category: 'vps', 
    name: 'BASIC VPS 3', 
    price: 30000, 
    stock: 8,
    desc: "✅ RAM: 2GB Dedicated\n✅ CPU: 2 Core (Multithread)\n✅ Storage: 50GB NVMe SSD\n✅ Bandwidth: 2TB\n✅ Anti-DDoS Basic\n🚀 Cocok untuk: Script Multiprocess, Database." 
  },
  { 
    id: 'vps4', 
    category: 'vps', 
    name: 'STANDARD VPS', 
    price: 35000, 
    stock: 20, 
    recommend: true,
    desc: "🔥 BEST SELLER!\n✅ RAM: 4GB Dedicated\n✅ CPU: 2 Core High Performance\n✅ Storage: 80GB NVMe SSD\n✅ Bandwidth: 4TB\n✅ Support Docker\n🚀 Cocok untuk: Game Server (MCPE/SAMP), Bot Music, Store Online." 
  },
  { 
    id: 'vps5', 
    category: 'vps', 
    name: 'HIGH VPS 1', 
    price: 45000, 
    stock: 5,
    desc: "✅ RAM: 8GB Dedicated\n✅ CPU: 4 Core Extreme\n✅ Storage: 160GB NVMe SSD\n✅ Bandwidth: 5TB\n✅ Virtualisasi KVM\n🚀 Cocok untuk: Server Minecraft Java, Website Traffic Tinggi." 
  },
  { 
    id: 'vps6', 
    category: 'vps', 
    name: 'HIGH VPS 2', 
    price: 70000, 
    stock: 3,
    desc: "✅ RAM: 16GB Dedicated\n✅ CPU: 4 Core Extreme\n✅ Storage: 240GB NVMe SSD\n✅ Bandwidth: 5TB\n✅ Network 1Gbps\n🚀 Cocok untuk: Komunitas Game Besar, App Server Berat." 
  },

  // === PANEL PTERODACTYL ===
  { 
    id: 'pnl1', 
    category: 'panel', 
    name: 'PANEL HEMAT 1GB', 
    price: 1000, 
    stock: 50,
    desc: "🔹 RAM: 1GB\n🔹 CPU: 35%\n🔹 Disk: 1GB\n🔹 Server: Indonesia\n✨ Cocok untuk coba-coba atau script bot sangat ringan." 
  },
  { 
    id: 'pnl2', 
    category: 'panel', 
    name: 'PANEL HEMAT 2GB', 
    price: 2000, 
    stock: 50,
    desc: "🔹 RAM: 2GB\n🔹 CPU: 50%\n🔹 Disk: 2GB\n🔹 Server: Indonesia\n✨ Cocok untuk Bot WhatsApp Single Session." 
  },
  { 
    id: 'pnl3', 
    category: 'panel', 
    name: 'PANEL HEMAT 3GB', 
    price: 3000, 
    stock: 40,
    desc: "🔹 RAM: 3GB\n🔹 CPU: 95%\n🔹 Disk: 3GB\n🔹 Server: Indonesia\n✨ Stabil untuk Bot Discord atau WA Multi-Device." 
  },
  { 
    id: 'pnl4', 
    category: 'panel', 
    name: 'PANEL HEMAT 4GB', 
    price: 4000, 
    stock: 30,
    desc: "🔹 RAM: 4GB\n🔹 CPU: 110%\n🔹 Disk: 4GB\n🔹 Server: Singapore\n✨ Kuat untuk menjalankan 2-3 script bot sekaligus." 
  },
  { 
    id: 'pnl5', 
    category: 'panel', 
    name: 'PANEL STANDAR 5GB', 
    price: 5000, 
    stock: 25,
    desc: "🔹 RAM: 5GB\n🔹 CPU: 135%\n🔹 Disk: 5GB\n🔹 Server: Singapore Premium\n✨ Rekomendasi untuk Server SAMP/MTA dengan player sedang." 
  },
  { 
    id: 'pnl6', 
    category: 'panel', 
    name: 'PANEL STANDAR 6GB', 
    price: 6000, 
    stock: 20,
    desc: "🔹 RAM: 6GB\n🔹 CPU: 160%\n🔹 Disk: 6GB\n🔹 Server: Singapore Premium\n✨ Performa tinggi untuk kebutuhan hosting medium." 
  },
  { 
    id: 'pnl7', 
    category: 'panel', 
    name: 'PANEL STANDAR 7GB', 
    price: 7000, 
    stock: 20,
    desc: "🔹 RAM: 7GB\n🔹 CPU: 185%\n🔹 Disk: 7GB\n🔹 Server: Singapore Premium\n✨ Cocok untuk Bot Music High Quality Audio." 
  },
  { 
    id: 'pnl8', 
    category: 'panel', 
    name: 'PANEL TURBO 8GB', 
    price: 8000, 
    stock: 15,
    desc: "🔹 RAM: 8GB\n🔹 CPU: 200%\n🔹 Disk: 8GB\n🔹 Server: Singapore Premium\n✨ Sangat lancar untuk Minecraft PE server kecil." 
  },
  { 
    id: 'pnl9', 
    category: 'panel', 
    name: 'PANEL TURBO 9GB', 
    price: 9000, 
    stock: 15,
    desc: "🔹 RAM: 9GB\n🔹 CPU: 300%\n🔹 Disk: 9GB\n🔹 Performa Stabil & Cepat\n✨ Pilihan terbaik sebelum upgrade ke Unlimited." 
  },

  // === PANEL PREMIUM ===
  { 
    id: 'prem1', 
    category: 'panel', 
    name: 'PANEL UNLIMITED', 
    price: 10000, 
    stock: 10, 
    recommend: true,
    desc: "👑 KHUSUS SULTAN\n♾️ RAM: Unlimited\n♾️ CPU: Unlimited\n♾️ Disk: Unlimited\n🛡️ Garansi Anti Suspend (S&K)\n✨ Bebas deploy apa saja sepuasnya!" 
  },
  { 
    id: 'prem2', 
    category: 'panel', 
    name: 'RESELLER PANEL', 
    price: 15000, 
    stock: 5,
    desc: "💼 PAKET USAHA 1\n✅ Dapat Akun Reseller\n✅ Bisa Membuat Panel Sendiri\n✅ Bisa Jual Panel ke Orang Lain\n💰 Cocok untuk pemula bisnis hosting." 
  },
  { 
    id: 'prem3', 
    category: 'panel', 
    name: 'ADMIN PANEL', 
    price: 20000, 
    stock: 5, 
    recommend: true,
    desc: "💼 PAKET USAHA 2\n✅ Dapat Akun Admin Panel\n✅ Full Akses Create/Delete Server\n✅ Bisa Open Reseller Panel\n💰 Potensi Balik Modal Sangat Cepat!" 
  },
  { 
    id: 'prem4', 
    category: 'panel', 
    name: 'OWNER PANEL', 
    price: 25000, 
    stock: 3,
    desc: "🏢 TINGKAT TERTINGGI\n✅ Akses Panel Owner\n✅ Bisa Bikin Admin & Reseller\n✅ Full Control Resource Server\n✅ Prioritas Support." 
  },
  { 
    id: 'prem5', 
    category: 'panel', 
    name: 'PT PANEL (PARTNER)', 
    price: 35000, 
    stock: 2, 
    recommend: true,
    desc: "🤝 PAKET PARTNER\n✅ Join Manajemen\n✅ Akses Database Panel\n✅ Bebas Pasang Iklan di Panel\n✅ Full Support Teknis." 
  },

  // === JASA LAINNYA ===
  { 
    id: 'oth1', 
    category: 'other', 
    name: 'JASA INSTALL PANEL', 
    price: 10000, 
    desc: "🛠️ Terima Beres!\nKami instalkan Panel Pterodactyl di VPS Anda.\nTermasuk konfigurasi Domain & SSL (HTTPS)." 
  },
  { 
    id: 'oth2', 
    category: 'other', 
    name: 'BASH AUTOSCRIPT', 
    price: 15000, 
    desc: "📜 Script Auto Install\nBuat Panel Pterodactyl sendiri hanya dengan 1 baris perintah.\nSupport Ubuntu 20.04/22.04." 
  },
  { 
    id: 'oth3', 
    category: 'other', 
    name: 'FIX ERROR SCRIPT', 
    price: 7000, 
    desc: "🔧 Bot Anda Error?\nKami bantu perbaiki error pada script Bot WA/Telegram/Discord.\nHarga tergantung tingkat kesulitan." 
  },
  { 
    id: 'oth4', 
    category: 'other', 
    name: 'JASA RENAME SC', 
    price: 20000, 
    desc: "✏️ Rebranding Script\nGanti nama author, credit, dan tampilan script bot agar terlihat seperti milik Anda sendiri." 
  },
  { 
    id: 'oth5', 
    category: 'other', 
    name: 'PEMBUATAN WEBSITE', 
    price: 30000, 
    desc: "🌐 Website Profesional\nLanding Page, Top Up Game, atau Company Profile.\nDesain Responsif & Modern." 
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('products', JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};
