import Image from 'next/image';
import Link from 'next/link';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, NY',
      avatar: '/avatar1.jpg', // This would be replaced with actual image
      text: 'The dining table we ordered is absolutely amazing. The attention to detail and craftsmanship is beyond what we expected. It has become the centerpiece of our home.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      location: 'Austin, TX',
      avatar: '/avatar2.jpg', // This would be replaced with actual image
      text: 'I loved the 3D configurator to design a custom bookshelf for my study. The finished product perfectly matches what I envisioned. Exceptional quality and service!',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Chen',
      location: 'Seattle, WA',
      avatar: '/avatar3.jpg', // This would be replaced with actual image
      text: 'Hufano Handicraft created a set of wooden coasters for my wedding gifts. My guests were amazed by the quality and personalization. Truly special work!',
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-8 md:px-16 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 bg-[#f0e6d9] text-[#8B4513] rounded-full text-sm mb-4">Client Stories</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">What Our Customers Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover the experiences of those who have welcomed our wooden masterpieces into their homes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                  {/* Placeholder for avatar */}
                  <div className="w-full h-full flex items-center justify-center">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-[#3c2415]">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="flex text-[#8B4513]">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* <div className="text-center mt-8">
          <button className="border border-[#8B4513] text-[#8B4513] px-6 py-3 rounded hover:bg-[#f0e6d9] transition-colors">
            Read More Reviews
          </button>
        </div> */}
      </div>
    </section>
  );
}