import type { Metadata } from 'next';
import '@picocss/pico/css/pico.min.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'FlavorAI',
  description: 'Recipe Discovery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}