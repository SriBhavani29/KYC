export function validateMobile(phone) {
  // Mobile number: Exactly 10 digits, starting with 6, 7, 8, or 9
  const regex = /^[6-9]\d{9}$/;
  return regex.test(String(phone).trim());
}

export function validateIFSC(ifsc) {
  // Standard Indian IFSC: 4 alphabetic characters, followed by 0, followed by 6 alphanumeric characters
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(String(ifsc).trim().toUpperCase());
}

export function validateBankAccount(accNo) {
  // Numeric only, standard length 9 to 18 digits
  const regex = /^\d{9,18}$/;
  return regex.test(String(accNo).trim());
}

export function validateKYCSubmission(body) {
  const errors = [];

  if (!body.fullName || body.fullName.trim().length < 3) {
    errors.push('Full name is required (minimum 3 characters).');
  }

  if (!body.category) {
    errors.push('User category is required (Vendor, Customer, Agent, Manager, Delivery Partner, Technician).');
  }

  if (!body.mobile || !validateMobile(body.mobile)) {
    errors.push('Invalid mobile number: Must be exactly 10 digits starting with 6, 7, 8, or 9.');
  }

  if (!body.bankAccountNo || !validateBankAccount(body.bankAccountNo)) {
    errors.push('Invalid Bank Account Number: Numeric only, between 9 and 18 digits.');
  }

  if (!body.ifscCode || !validateIFSC(body.ifscCode)) {
    errors.push('Invalid IFSC code: Must match standard Indian format (e.g. HDFC0001234).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

