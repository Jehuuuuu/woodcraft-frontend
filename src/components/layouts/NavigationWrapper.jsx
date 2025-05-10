'use client';
import { usePathname } from 'next/navigation';
import Header from '../home/Header';
import Footer from '../home/Footer';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');
  return (
    <>
      {!isLoginPage && !isAdminPage && <Header />}
      {children}
      {!isLoginPage && !isAdminPage && <Footer />}
    </>
  );
}