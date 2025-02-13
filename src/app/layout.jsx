import { Roboto, Merriweather } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata = {
  title: "Genesis Group Home LLC - Professional Home Care Services",
  description: "Providing compassionate and professional home care services with a focus on quality of life and personalized care plans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${merriweather.variable}`}>
      <body className="bg-[#FFFDE7]">{children}</body>
    </html>
  );
}
