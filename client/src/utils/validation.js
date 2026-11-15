// Enterprise Validations for Indian KYC Standards

/**
 * Mobile number: Exactly 10 digits, starting with 6, 7, 8, or 9
 */
export function validateMobile(mobile) {
  if (!mobile) return { valid: false, error: 'Mobile number is required' };
  const cleaned = String(mobile).trim();
  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.'
    };
  }
  return { valid: true, error: null };
}

/**
 * Bank account number: Numeric only, validated according to bank requirements (9 to 18 digits)
 */
export function validateBankAccount(accountNo) {
  if (!accountNo) return { valid: false, error: 'Bank account number is required' };
  const cleaned = String(accountNo).trim();
  const regex = /^\d{9,18}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: 'Bank account number must be numeric only, between 9 and 18 digits.'
    };
  }
  return { valid: true, error: null };
}

/**
 * IFSC code: Validate standard Indian IFSC format (4 characters, 0, 6 alphanumeric)
 */
export function validateIFSC(ifsc) {
  if (!ifsc) return { valid: false, error: 'IFSC Code is required' };
  const cleaned = String(ifsc).trim().toUpperCase();
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: 'IFSC Code must follow Indian banking format (e.g., HDFC0001234, SBIN0000691).'
    };
  }
  return { valid: true, error: null };
}

/**
 * Currency Formatter (INR)
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

/**
 * Date Formatter
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

