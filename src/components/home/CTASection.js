import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 px-8 bg-[var(--primary-color)] text-white">
      <div className="max-w-6xl mx-auto text-center">
      <span className="inline-block px-4 py-1 bg-[#f0e6d9] text-[#8B4513] rounded-full text-sm mb-4">
          Start Your Journey
        </span>
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
          Ready to Transform Your Space with Timeless Woodcraft?
        </h2>
        
        <p className = "max-w-2xl mx-auto mb-5">
          <span className="text-[var(--light-bg)] ">
            Whether you're looking for ready-made pieces or want to design your own custom
            creation, we're here to bring your vision to life.
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#" className="bg-white text-[#8B4513] px-6 py-3 rounded flex items-center justify-center hover:bg-[#f0e6d9] transition-colors">
            Browse Catalog
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href="/contact" className="border border-white text-white px-6 py-3 rounded flex items-center justify-center hover:bg-[var(--secondary-color)] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}