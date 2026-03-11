import './globals.css';
import { AuthProvider } from '../hooks/useAuth';

export const metadata = {
  title: 'VF Finance - Gestão Inteligente',
  description: 'Seu assistente financeiro pessoal com inteligência e simplicidade.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
