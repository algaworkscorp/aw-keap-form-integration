export function getAccessToken(): string {
  const token = process.env.KEAP_ACCESS_TOKEN;
  if (!token) throw new Error('KEAP_ACCESS_TOKEN não configurado');
  return token;
}
