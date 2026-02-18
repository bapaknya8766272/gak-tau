import type { CartItem } from '@/types';

const PAKASIR_BASE_URL = 'https://app.pakasir.com';

// Konfigurasi Pakasir - Ganti dengan data proyek Anda
const PAKASIR_CONFIG = {
  // TODO: Ganti dengan slug proyek Anda dari dashboard Pakasir
  slug: 'bot-wa111111111', // <-- GANTI INI
  
  // TODO: Ganti dengan API key Anda (untuk API method)
  apiKey: 'EVzkbnwsLcOnnVnulZGuhXJVbr0iQPnc', // <-- GANTI INI jika pakai API method
};

/**
 * Generate Pakasir payment URL (Method URL - Paling Mudah)
 * 
 * Format: https://app.pakasir.com/pay/{slug}/{amount}?order_id={order_id}
 * 
 * Opsi tambahan:
 * - &redirect=https://website.com/success (custom redirect)
 * - &qris_only=1 (hanya tampilkan QRIS)
 */
export function generatePakasirUrl(
  amount: number,
  orderId: string,
  options?: {
    redirectUrl?: string;
    qrisOnly?: boolean;
  }
): string {
  let url = `${PAKASIR_BASE_URL}/pay/${PAKASIR_CONFIG.slug}/${amount}?order_id=${orderId}`;
  
  if (options?.redirectUrl) {
    url += `&redirect=${encodeURIComponent(options.redirectUrl)}`;
  }
  
  if (options?.qrisOnly) {
    url += `&qris_only=1`;
  }
  
  return url;
}

/**
 * Generate Pakasir PayPal URL
 * Format: https://app.pakasir.com/paypal/{slug}/{amount}?order_id={order_id}
 */
export function generatePakasirPaypalUrl(
  amount: number,
  orderId: string,
  redirectUrl?: string
): string {
  let url = `${PAKASIR_BASE_URL}/paypal/${PAKASIR_CONFIG.slug}/${amount}?order_id=${orderId}`;
  
  if (redirectUrl) {
    url += `&redirect=${encodeURIComponent(redirectUrl)}`;
  }
  
  return url;
}

/**
 * Create transaction via API (Method API - Lebih Advanced)
 * 
 * POST https://app.pakasir.com/api/transactioncreate/{method}
 * 
 * Methods: qris, cimb_niaga_va, bni_va, sampoerna_va, bnc_va, 
 *          maybank_va, permata_va, atm_bersama_va, artha_graha_va, bri_va, paypal
 */
export async function createPakasirTransaction(
  method: 'qris' | 'cimb_niaga_va' | 'bni_va' | 'bri_va' | 'paypal' | string,
  data: {
    orderId: string;
    amount: number;
  }
): Promise<{
  success: boolean;
  payment?: {
    project: string;
    order_id: string;
    amount: number;
    fee: number;
    total_payment: number;
    payment_method: string;
    payment_number: string; // QR string atau VA number
    expired_at: string;
  };
  error?: string;
}> {
  try {
    if (!PAKASIR_CONFIG.apiKey) {
      return {
        success: false,
        error: 'API Key belum dikonfigurasi'
      };
    }

    const response = await fetch(`${PAKASIR_BASE_URL}/api/transactioncreate/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project: PAKASIR_CONFIG.slug,
        order_id: data.orderId,
        amount: data.amount,
        api_key: PAKASIR_CONFIG.apiKey,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal membuat transaksi');
    }

    return {
      success: true,
      payment: result.payment,
    };
  } catch (error) {
    console.error('Pakasir API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan',
    };
  }
}

/**
 * Check transaction status
 * GET https://app.pakasir.com/api/transactiondetail?project={slug}&amount={amount}&order_id={order_id}&api_key={api_key}
 */
export async function checkTransactionStatus(
  orderId: string,
  amount: number
): Promise<{
  success: boolean;
  transaction?: {
    amount: number;
    order_id: string;
    project: string;
    status: 'pending' | 'completed' | 'expired' | 'cancelled';
    payment_method: string;
    completed_at: string;
  };
  error?: string;
}> {
  try {
    if (!PAKASIR_CONFIG.apiKey) {
      return {
        success: false,
        error: 'API Key belum dikonfigurasi'
      };
    }

    const url = `${PAKASIR_BASE_URL}/api/transactiondetail?project=${PAKASIR_CONFIG.slug}&amount=${amount}&order_id=${orderId}&api_key=${PAKASIR_CONFIG.apiKey}`;
    
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal cek status');
    }

    return {
      success: true,
      transaction: result.transaction,
    };
  } catch (error) {
    console.error('Pakasir Status Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan',
    };
  }
}

/**
 * Cancel transaction
 * POST https://app.pakasir.com/api/transactioncancel
 */
export async function cancelTransaction(
  orderId: string,
  amount: number
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!PAKASIR_CONFIG.apiKey) {
      return {
        success: false,
        error: 'API Key belum dikonfigurasi'
      };
    }

    const response = await fetch(`${PAKASIR_BASE_URL}/api/transactioncancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project: PAKASIR_CONFIG.slug,
        order_id: orderId,
        amount: amount,
        api_key: PAKASIR_CONFIG.apiKey,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal membatalkan transaksi');
    }

    return {
      success: true,
      message: 'Transaksi dibatalkan',
    };
  } catch (error) {
    console.error('Pakasir Cancel Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan',
    };
  }
}

/**
 * Generate WhatsApp confirmation message
 */
export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  orderId?: string
): string {
  const message = `Halo Admin ALFA Hosting! 👋

Saya ingin konfirmasi pesanan:
${items.map(item => `📦 ${item.service} x${item.quantity}`).join('\n')}

💰 Total: Rp ${total.toLocaleString('id-ID')}
${orderId ? `🆔 Order ID: ${orderId}` : ''}

Mohon diproses ya. Terima kasih! 🙏`;

  return encodeURIComponent(message);
}

/**
 * Open WhatsApp with order details
 */
export function openWhatsApp(
  phoneNumber: string,
  items: CartItem[],
  total: number,
  orderId?: string
): void {
  const message = generateWhatsAppMessage(items, total, orderId);
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
}

/**
 * Setup webhook handler
 * Webhook akan dikirim ke URL yang Anda daftarkan di dashboard Pakasir
 * 
 * Format webhook:
 * {
 *   "amount": 22000,
 *   "order_id": "240910HDE7C9",
 *   "project": "depodomain",
 *   "status": "completed",
 *   "payment_method": "qris",
 *   "completed_at": "2024-09-10T08:07:02.819+07:00"
 * }
 */
export function handleWebhook(payload: {
  amount: number;
  order_id: string;
  project: string;
  status: string;
  payment_method: string;
  completed_at: string;
}): {
  isValid: boolean;
  orderId: string;
  amount: number;
  isCompleted: boolean;
} {
  // Validasi payload
  const isValid = 
    payload.project === PAKASIR_CONFIG.slug &&
    !!payload.order_id &&
    payload.amount > 0;

  return {
    isValid,
    orderId: payload.order_id,
    amount: payload.amount,
    isCompleted: payload.status === 'completed',
  };
}

// Export config untuk digunakan di komponen
export { PAKASIR_CONFIG };
