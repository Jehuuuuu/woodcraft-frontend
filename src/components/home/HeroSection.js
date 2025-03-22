import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-16 px-8 md:px-16 bg[var(--light-bg)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <span className="inline-block px-4 py-1 bg-[#f0e6d9] text-[#8B4513] rounded-full text-sm mb-4">
            Handcrafted with Passion & Precision
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#3c2415] mb-4">
            Timeless Woodcraft
            <span className="block text-[var(--primary-color)]">Artistry for Your Home</span>
          </h1>   
          
          <p className="text-brown-700 py-2 mb-5 max-w-2xl text-lg  mx-auto">
            Discover our collection of bespoke wooden furniture and decor,
            each piece telling a unique story of craftsmanship and heritage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center ">
            <Link href="#" className="bg-[var(--primary-color)] text-white px-6 py-3 rounded flex items-center justify-center hover:bg-[var(--secondary-color)] transition-colors">
              Explore Collection
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="border border-[#8B4513] text-[#8B4513] px-6 py-3 rounded flex items-center justify-center hover:bg-[#f0e6d9] transition-colors">
              Custom Design
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mt-20 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 p-8 rounded-lg">
          <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Handcrafted Quality</h3>
          <p className="text-gray-700">
            Every piece meticulously crafted with attention to detail and premium materials.
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 p-8 rounded-lg">
          <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Bespoke Designs</h3>
          <p className="text-gray-700">
            Custom creations tailored to your space, style, and specific requirements.
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 p-8 rounded-lg">
          <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Sustainable Materials</h3>
          <p className="text-gray-700">
            Ethically sourced woods and eco-friendly practices for responsible craftsmanship.
          </p>
        </div>
      </div>
    </section>
  );
}