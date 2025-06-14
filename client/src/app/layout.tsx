// client/app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia } from 'wagmi/chains';
import { lightTheme } from '@rainbow-me/rainbowkit';


// Google Fonts — Inter и DM Sans
import { Inter, DM_Sans } from 'next/font/google';

// Импортируем Header
import Header from '@/components/Header/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const config = getDefaultConfig({
  appName: 'Hackathon App',
  projectId: 'my-hackathon-dapp',
  chains: [mainnet, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider 
              theme={lightTheme({
                accentColor: '#a98d5d',        // твой желаемый цвет кнопки
                accentColorForeground: '#fff', // цвет текста на кнопке
                borderRadius: 'large',         // или 'small' | 'medium'
                fontStack: 'system',           // или 'rounded', 'mono'
              })}>
              <Header />
              <main style={{ paddingTop: '60px' }}>
                {children}
              </main>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
