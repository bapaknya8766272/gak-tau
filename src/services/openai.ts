import OpenAI from 'openai';

// In production, this should be an environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Kamu adalah Customer Service AI dari ALFA Hosting, sebuah penyedia layanan hosting VPS dan Panel Pterodactyl di Indonesia.

Informasi Produk:
- VPS Cloud: Mulai dari Rp 15.000 (1GB RAM) hingga Rp 70.000 (16GB RAM)
- Panel Pterodactyl: Mulai dari Rp 1.000 (1GB RAM) hingga Rp 35.000 (Partner Panel)
- Jasa: Install Panel (Rp 10.000), Bash Autoscript (Rp 15.000), Fix Error (Rp 7.000), Rename SC (Rp 20.000), Pembuatan Website (Rp 30.000)

Kontak:
- WhatsApp: +62 822-2676-9163
- Email: sanzbot938@gmail.com
- Lokasi: Jawa Tengah, Blora, Randublatung

Pembayaran: QRIS, DANA, GoPay, OVO, Transfer Bank

Jawablah dengan:
1. Sopan dan ramah
2. Singkat dan jelas
3. Bahasa Indonesia yang baik
4. Berikan solusi yang membantu

Jika ada pertanyaan teknis kompleks, arahkan untuk menghubungi admin via WhatsApp.`;

export async function getAIResponse(message: string): Promise<string> {
  try {
    // Fallback responses for common questions when API key is not available
    if (!OPENAI_API_KEY) {
      return getFallbackResponse(message);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || getFallbackResponse(message);
  } catch (error) {
    console.error('OpenAI Error:', error);
    return getFallbackResponse(message);
  }
}

function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('harga') || lowerMsg.includes('biaya') || lowerMsg.includes('price')) {
    return "💰 Berikut daftar harga kami:\n\n🖥️ VPS: Rp 15.000 - Rp 70.000\n📊 Panel: Rp 1.000 - Rp 35.000\n🛠️ Jasa: Rp 7.000 - Rp 30.000\n\nCek website untuk detail lengkap ya!";
  }
  
  if (lowerMsg.includes('cara') && lowerMsg.includes('beli')) {
    return "🛒 Cara pembelian:\n1. Pilih produk di website\n2. Klik 'Tambah ke Keranjang'\n3. Lanjut ke pembayaran\n4. Pilih metode pembayaran\n5. Konfirmasi via WhatsApp\n\nMudah kan? 😊";
  }
  
  if (lowerMsg.includes('pembayaran') || lowerMsg.includes('bayar') || lowerMsg.includes('payment')) {
    return "💳 Kami menerima pembayaran via:\n• QRIS (Semua e-wallet)\n• DANA\n• GoPay\n• OVO\n• Transfer Bank\n\nSemua transaksi aman dan terpercaya!";
  }
  
  if (lowerMsg.includes('panel') || lowerMsg.includes('pterodactyl')) {
    return "📊 Panel Pterodactyl kami tersedia mulai Rp 1.000 saja!\n\n✨ Fitur:\n• Server Indonesia & Singapore\n• Resource fleksibel\n• Support 24/7\n• Aktivasi instan\n\nCek katalog untuk pilihan lengkap!";
  }
  
  if (lowerMsg.includes('vps') || lowerMsg.includes('server')) {
    return "🖥️ VPS Cloud kami powerful dan terjangkau!\n\n✨ Spesifikasi:\n• NVMe SSD Storage\n• High Performance CPU\n• Bandwidth besar\n• Full Root Access\n• Garansi Uptime\n\nMulai dari Rp 15.000/bulan!";
  }
  
  if (lowerMsg.includes('admin') || lowerMsg.includes('owner') || lowerMsg.includes('kontak')) {
    return "📞 Hubungi kami:\n\n• WhatsApp: +62 822-2676-9163\n• Email: sanzbot938@gmail.com\n• Lokasi: Jawa Tengah, Blora\n\nAdmin siap bantu 24/7! 🚀";
  }
  
  if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi') || lowerMsg.includes('p')) {
    return "Halo! 👋 Selamat datang di ALFA Hosting!\n\nSaya AI Assistant yang siap membantu Anda. Ada yang bisa saya bantu tentang layanan VPS, Panel, atau Jasa kami?";
  }
  
  if (lowerMsg.includes('terima kasih') || lowerMsg.includes('thanks') || lowerMsg.includes('makasih')) {
    return "Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya!";
  }
  
  if (lowerMsg.includes('stok') || lowerMsg.includes('stock') || lowerMsg.includes('tersedia')) {
    return "📦 Stok kami selalu terupdate di website. Jika produk bisa ditambahkan ke keranjang, berarti stok masih tersedia.\n\nUntuk info real-time, silakan cek langsung di katalog produk kami!";
  }
  
  return "Maaf, saya kurang mengerti pertanyaan Anda. 🤔\n\nAnda bisa bertanya tentang:\n• Harga produk\n• Cara pembelian\n• Metode pembayaran\n• Spesifikasi VPS/Panel\n• Kontak admin\n\nAtau langsung hubungi WhatsApp: +62 822-2676-9163";
}
