export const evaluatePasswordStrength = (password) => {
  const errors = [];
  if (!password) {
    return { isStrong: false, errors: ["Password is required"] };
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[\W_]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password must not contain repetitive characters");
  }

  const seq = "0123456789abcdefghijklmnopqrstuvwxyz";
  const lowered = password.toLowerCase();
  for (let i = 0; i < seq.length - 2; i++) {
    const asc = seq.slice(i, i + 3);
    const desc = asc.split("").reverse().join("");
    if (lowered.includes(asc) || lowered.includes(desc)) {
      errors.push("Password must not contain sequential characters");
      break;
    }
  }

  for (let subLen = 2; subLen <= Math.floor(password.length / 2); subLen++) {
    for (let i = 0; i <= password.length - subLen * 2; i++) {
      const substr = password.substr(i, subLen);
      if (password.substr(i + subLen, subLen) === substr) {
        errors.push("Password must not contain repeated sequences");
        i = password.length;
        subLen = password.length;
      }
    }
  }

  return {
    isStrong: errors.length === 0,
    errors: errors,
  };
};
