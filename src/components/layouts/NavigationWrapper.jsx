'use client';
import { usePathname } from 'next/navigation';
import Header from '../home/Header';
import Footer from '../home/Footer';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}