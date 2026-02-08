import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import MenuWithCursor from "@/components/MenuWithCursor";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  title: "E-Library Digitopia",
  description: "Access thousands of books, journals, and digital resources anytime, anywhere",
};

const menuItems = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to home page',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Catalog',
    href: '/catalog',
    ariaLabel: 'Browse our catalog',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Events',
    href: '/events',
    ariaLabel: 'Library events',
    rotation: -8,
    hoverStyles: { bgColor: '#ec4899', textColor: '#ffffff' }
  },
  {
    label: 'About',
    href: '/about',
    ariaLabel: 'About the library',
    rotation: 8,
    hoverStyles: { bgColor: '#14b8a6', textColor: '#ffffff' }
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    ariaLabel: 'View your dashboard',
    rotation: -8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'Login',
    href: '/login',
    ariaLabel: 'Sign in to your account',
    rotation: 8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <MenuWithCursor
          items={menuItems}
          // logo={<span style={{ fontWeight: 700, fontSize: '1.5rem' }}>EP</span>} //nanti ah logonya lagi males ama gatau mau masang apa sebagai logo
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
