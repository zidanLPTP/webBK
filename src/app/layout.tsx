import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BisikKampus",
  description: "Platform Menfess Mahasiswa Anonim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* 2. PASANG KOMPONEN TOASTER DI SINI */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#F3E8FF', 
                color: '#5D3891',      
                border: '1px solid #5D3891',
                fontWeight: 'bold',
              },
            },
            error: {
              style: {
                background: '#FEE2E2',
                color: '#B91C1C',
                fontWeight: 'bold',
              },
            },
          }}
        />
        
        {children}
      </body>
    </html>
  );
}