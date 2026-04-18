import crypto from 'crypto';

const KEY = process.env.EASEBUZZ_KEY || '';
const SALT = process.env.EASEBUZZ_SALT || '';
const ENV = process.env.EASEBUZZ_ENV || 'production';

export const EASEBUZZ_BASE = ENV === 'production'
  ? 'https://pay.easebuzz.in'
  : 'https://testpay.easebuzz.in';

export interface EasebuzzParams {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  udf1?: string; // bookingReference
  udf2?: string; // totalAmount
  surl: string;
  furl: string;
}

export function buildHash(params: EasebuzzParams): string {
  const hashStr = [
    KEY, params.txnid, params.amount, params.productinfo,
    params.firstname, params.email,
    params.udf1 || '', params.udf2 || '', '', '', '',
    '', '', '', '', '',
    SALT,
  ].join('|');
  return crypto.createHash('sha512').update(hashStr).digest('hex');
}

export async function initiatePayment(params: EasebuzzParams): Promise<{ paymentUrl: string; txnid: string }> {
  if (!KEY || !SALT) throw new Error('Easebuzz credentials not configured');

  const hash = buildHash(params);
  const formData = new URLSearchParams({
    key: KEY,
    txnid: params.txnid,
    amount: params.amount,
    productinfo: params.productinfo,
    firstname: params.firstname,
    email: params.email,
    phone: params.phone,
    udf1: params.udf1 || '',
    udf2: params.udf2 || '',
    udf3: '', udf4: '', udf5: '',
    hash,
    surl: params.surl,
    furl: params.furl,
  });

  const res = await fetch(`${EASEBUZZ_BASE}/payment/initiateLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  const json = await res.json() as { status: number; data?: string; error_desc?: string; message?: string };

  if (json.status === 1 && json.data) {
    return { paymentUrl: `${EASEBUZZ_BASE}/pay/${json.data}`, txnid: params.txnid };
  }
  throw new Error(json.error_desc || json.message || 'Easebuzz payment initiation failed');
}

export function verifyWebhookHash(received: string, params: {
  txnid: string; amount: string; productinfo: string; firstname: string;
  email: string; status: string; udf1?: string; udf2?: string;
}): boolean {
  // Easebuzz reverse hash for webhook verification: SALT|status|...|KEY
  const hashStr = [
    SALT, params.status,
    '', '', '', params.udf2 || '', params.udf1 || '',
    params.email, params.firstname, params.productinfo,
    params.amount, params.txnid, KEY,
  ].join('|');
  const expected = crypto.createHash('sha512').update(hashStr).digest('hex');
  return expected === received;
}
