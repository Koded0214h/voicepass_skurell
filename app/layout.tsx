import type { Metadata } from "next";
// import { Manrope, Material_Symbols_Outlined } from 'next/font/google';
import { Manrope } from 'next/font/google';
import "./globals.css";

const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// const materialSymbolsOutlined = Material_Symbols_Outlined({
//   weight: ['400'],
//   variable: '--font-material-symbols-outlined',
//   display: 'swap',
//   text: 'phone_in_talk graphic_eq check_circle trending_up account_balance_wallet error add logout dashboard list_alt analytics credit_card settings lock visibility visibility_off key arrow_forward',
// });

export const metadata: Metadata = {
  title: "VoicePass - Secure Voice OTP",
  description: "Reliable, encrypted voice verification calls for your application",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}