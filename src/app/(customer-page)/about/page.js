'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Our Story Section */}
      <section className="py-22 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-[#8B4513] mb-2">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">A Legacy of Woodcraft Excellence</h2>
            
            <p className="text-gray-700 mb-6">
              Founded in 1985 by master craftsman Antonio Hufano, our workshop began as a small family business 
              dedicated to preserving traditional Filipino woodworking techniques while embracing modern design sensibilities.
            </p>
            
            <p className="text-gray-700 mb-6">
              For over three decades, we've grown from a modest workshop to a renowned studio of artisans, 
              each bringing unique skills and perspectives to our collective craft. Our dedication to quality 
              and sustainability has earned us recognition both locally and internationally.
            </p>
            
            <p className="text-gray-700">
              Today, Hufano Handicraft continues to be family-owned and operated, with the second generation 
              of craftspeople leading our workshop into a new era of innovative design while honoring our rich heritage.
            </p>
          </div>
          
          <div className="bg-[#f9f5f0] p-8 rounded-lg">
            <div className="relative h-96 w-full bg-[#e6dfd5] rounded-lg flex items-center justify-center">
              <Image
              src={'/workshop/workshop-image.jpg'}
              alt={'Workshop Image'}
              width={500}
              height={100}
              className='rounded-md h-96 object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-8 md:px-16 bg-[#fcfaf8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[#8B4513] mb-2">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">The Values That Guide Us</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              At the heart of Hufano Handicraft are the principles that have guided our work since day one.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <div className="bg-[#f0e6d9] rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Craftsmanship</h3>
              <p className="text-gray-700">
                We believe in the value of handcrafted quality. Each piece is meticulously created with attention to detail 
                and a commitment to excellence that can't be matched by mass production.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <div className="bg-[#f0e6d9] rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Sustainability</h3>
              <p className="text-gray-700">
                We are committed to responsible sourcing and sustainable practices. Our materials come from 
                managed forests, and we strive to minimize waste in every aspect of our production.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-lg">
              <div className="bg-[#f0e6d9] rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-4 4v12h4.8m8 0h4.2a4 4 0 004-4V8a4 4 0 00-4-4h-4.2a4 4 0 00-4 4v12h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415] mb-3">Heritage</h3>
              <p className="text-gray-700">
                We honor traditional techniques passed down through generations while embracing innovation. 
                This balance of old and new creates pieces that are both timeless and contemporary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[#8B4513] mb-2">The Artisans</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">Meet Our Craftspeople</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              The talented individuals who bring our vision to life through their skilled hands and creative minds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative h-64 w-full bg-[#f0e6d9] rounded-lg mb-4 flex items-center justify-center">
              <Image
               src={'/workshop/founder.jpg'}
               alt={'Founder Image'}
               width={400}
               height={100}
               className='rounded-md h-64 object-cover'
               />
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415]">Jojit Hufano</h3>
              <p className="text-[#8B4513]">Founder & Master Craftsman</p>
            </div>
            
            <div className="text-center">
              <div className="relative h-64 w-full bg-[#f0e6d9] rounded-lg mb-4 flex items-center justify-center">
              <Image
               src={'/workshop/designer.jpg'}
               alt={'Designer Image'}
               width={500}
               height={100}
               className='rounded-md h-64 object-contain'
               />
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415]">Irene Opena</h3>
              <p className="text-[#8B4513]">Design Director</p>
            </div>
            
            <div className="text-center">
              <div className="relative h-64 w-full bg-[#f0e6d9] rounded-lg mb-4 flex items-center justify-center">
              <Image
               src={'/workshop/worker.jpg'}
               alt={'Worker Image'}
               width={400}
               height={100}
               className='rounded-md h-64 object-cover'
               />
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#3c2415]">Berou Nocalan</h3>
              <p className="text-[#8B4513]">Senior Woodworker</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/contact" className="bg-[var(--primary-color)] text-white px-6 py-3 rounded inline-flex items-center hover:bg-[var(--secondary-color)] transition-colors">
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}