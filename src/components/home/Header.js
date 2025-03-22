import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-8 md:px-16 bg-white">
      <div className="flex items-center">
        <Link href="/" className="text-[#8B4513] font-serif">
          <h1 className="text-xl md:text-2xl font-bold">Hufano <span className="font-light">Handicraft</span></h1>
        </Link>
      </div>
      
      <nav className="hidden md:flex space-x-6">
        <Link href="#" className="text-gray-700 hover:text-[#8B4513]">Catalog</Link>
        <Link href="#" className="text-gray-700 hover:text-[#8B4513]">3D Configurator</Link>
        <Link href="/about" className="text-gray-700 hover:text-[#8B4513]">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-[#8B4513]">Contact</Link>
      </nav>
      
      <div className="flex items-center space-x-4">
        <Link href="#" className="text-gray-700 hover:text-[#8B4513]">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#8B4513] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </div>
        </Link>
        <Link href="#" className="text-gray-700 hover:text-[#8B4513]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
        <Link href="/login" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-[var(--secondary-color)] transition-colors">
          Login
        </Link>
      </div>
    </header>
  );
}