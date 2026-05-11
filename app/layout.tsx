import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integração Infusionsoft',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
