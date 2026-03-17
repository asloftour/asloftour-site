export function getClientIp(headers: Headers) {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}

export function sanitizeText(input?: string | null) {
  if (!input) return '';
  return input.replace(/[<>]/g, '').trim();
}

export function parseBoolean(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true' || value === '1';
}
