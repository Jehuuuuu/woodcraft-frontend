import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'Artisan Oak Coffee Table',
      price: 199.99,
      image: '/oak-table.jpg', // This would be replaced with actual image
      category: 'tables',
      isNew: true
    },
    {
      id: 2,
      name: 'Walnut Dining Chair',
      price: 249.99,
      image: '/walnut-chair.jpg', // This would be replaced with actual image
      category: 'chairs'
    },
    {
      id: 3,
      name: 'Handcrafted Wooden Bowl',
      price: 89.99,
      image: '/wooden-bowl.jpg', // This would be replaced with actual image
      category: 'decor',
      isNew: true
    }
  ];

  return (
    <section className="py-16 px-8 md:px-16 bg-[#f8f6f2]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 bg-[#f0e6d9] text-[#8B4513] rounded-full text-sm mb-4">Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">Featured Woodcraft Masterpieces</h2>
          <p className="text-[var(--muted-text)] max-w-2xl mx-auto">
            Discover our most popular handcrafted pieces, each telling a story of artisanal excellence and timeless design.
          </p>
        </div>

        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-1 md:space-x-2 md:flex-nowrap">
            <button className="bg-[var(--primary-color)] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">All</button>
            <button className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">Tables</button>
            <button className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">Chairs</button>
            <button className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">Decor</button>
            <button className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">Storage</button>
            <button className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">Wall Decor</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 bg-gray-100">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-[var(--primary-color)]0">Product Image</span>
                </div>
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                )}
                <button className="absolute top-2 right-2 text-[var(--primary-color)]0 hover:text-[#8B4513]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <span className="text-sm text-[var(--primary-color)]0">{product.category}</span>
                <h3 className="text-lg font-medium text-[#3c2415] mb-2">{product.name}</h3>
                <p className="text-[#8B4513] font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}