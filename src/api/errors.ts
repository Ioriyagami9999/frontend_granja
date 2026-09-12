export function extractErrorMessage(err: unknown, fallback: string): string {
  const message = (err as any)?.response?.data?.message ?? fallback;
  return Array.isArray(message) ? message.join(', ') : message;
}
