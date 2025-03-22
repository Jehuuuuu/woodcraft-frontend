export default function Heritage() {
  return (
    <section className="py-16 px-8 md:px-16 bg-[hsl(30,10%,15%)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-[#8B4513] mb-2">Our Heritage</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">Unparalleled Craftsmanship & Tradition</h2>
          
          <p className="text-gray-700 mb-6">
            At Hufano Handicraft, we blend traditional woodworking techniques with modern 
            design possibilities. Each piece is meticulously crafted by our artisans, who bring 
            decades of experience and passion to their work.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="bg-[#f0e6d9] rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Handcrafted by master artisans with 20+ years of experience</span>
            </li>
            <li className="flex items-center">
              <span className="bg-[#f0e6d9] rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Sustainably sourced premium hardwoods and materials</span>
            </li>
            <li className="flex items-center">
              <span className="bg-[#f0e6d9] rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Traditional joinery techniques for durability and longevity</span>
            </li>
            <li className="flex items-center">
              <span className="bg-[#f0e6d9] rounded-full p-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Each piece uniquely finished to enhance natural wood grain</span>
            </li>
          </ul>
          
          <button className="mt-8 bg-[var(--primary-color)] text-white px-6 py-3 rounded flex items-center hover:bg-[var(--secondary-color)] transition-colors">
            Our Process
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <div className="bg-yellow-300 h-80 w-full rounded-lg">  
            {/* This would be replaced with an actual image */}
            <div className="absolute bottom-0 right-0 bg-white p-4 rounded-tl-lg">
              <div className="text-4xl font-bold text-[#8B4513]">30+</div>
              <div className="text-sm text-gray-600">Years of Excellence</div>
            </div>
            <div className="absolute top-0 right-0 bg-white p-2 rounded-bl-lg">
              <div className="text-sm font-medium">100%</div>
              <div className="text-xs">handcrafted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}