import React, { useState, useEffect } from 'react';
import axios from 'axios';
import avatar1 from "../assets/avatar.jpg";

function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/reviews/randomReviews`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const reviewsData = response.data.data || response.data;
        
        if (!Array.isArray(reviewsData)) {
          throw new Error('Unexpected response format');
        }
        
        const formattedTestimonials = reviewsData.map(review => ({
          name: review.userDetails ? `${review.userDetails.firstName} ${review.userDetails.lastName}` : 'Anonymous User',
          service: review.serviceType,
          rating: review.rating || 5,
          text: review.review || 'Great service!',
          avatar: review.userDetails?.profilePicUrl || "/api/placeholder/48/48"
        }));
        
        setTestimonials(formattedTestimonials);
        setLoading(false);
      } catch (error) {
        setError('Failed to load testimonials');
        setLoading(false);
        setTestimonials([
          {
            name: "Michael Chen",
            service: "Home Cleaning Service",
            rating: 5,
            text: "The verification process gave me confidence in hiring a cleaner through Urban Assist. The service was excellent and exactly as described.",
            avatar: "frontend/src/assets/avatar1.jpg",
          },
        ]);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-indigo-50" aria-live="polite" aria-busy="true">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-indigo-50" aria-labelledby="user-testimonials-title">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="user-testimonials-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover why thousands of users and service providers trust Urban Assist
          </p>
        </div>

        <div className="relative mb-20" role="region" aria-labelledby="featured-testimonial-title">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-100 rounded-full opacity-50 hidden md:block" aria-hidden="true"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-100 rounded-full opacity-50 hidden md:block" aria-hidden="true"></div>
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-blue-100 rounded-full opacity-50 hidden md:block" aria-hidden="true"></div>

          <div className="absolute -top-8 left-10 md:left-20 text-indigo-200 text-[120px] leading-none font-serif" aria-hidden="true">
            "
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={avatar1}
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-md" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="mt-4 text-center md:text-left">
                  <h3 id="featured-testimonial-title" className="text-xl font-bold text-gray-900">Sarah Johnson</h3>
                  <p className="text-indigo-600 font-medium">Marketing Director</p>
                  <div className="flex items-center justify-center md:justify-start mt-2" aria-label={`Rating: 5 out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <blockquote className="text-gray-700 text-lg md:text-xl italic leading-relaxed">
                  Urban Assist transformed how our company finds reliable service providers. The verification process
                  gives us confidence, and the platform's intuitive design makes it easy to find exactly what we need.
                  We've saved countless hours that were previously spent vetting providers ourselves.
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="h-0.5 w-12 bg-indigo-500 mr-4" aria-hidden="true"></div>
                  <p className="text-gray-500">Used Urban Assist for 2+ years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label="User testimonials">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              role="listitem"
              aria-labelledby={`testimonial-${index}-name testimonial-${index}-text`}
            >
              <div className="mb-4 text-indigo-400" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>

              <div className="flex mb-4" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote id={`testimonial-${index}-text`} className="text-gray-700 mb-6">{testimonial.text}</blockquote>

              <div className="flex items-center">
                <div>
                  <h3 id={`testimonial-${index}-name`} className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;