const DivTwo = () => {
  return (
      <div className="mt-28 w-[80%] m-auto" role="region" aria-labelledby="unique-offerings-heading">
          <div className="md:text-center max-w-2xl mx-auto">
              <h2 id="unique-offerings-heading" className="md:text-4xl text-3xl font-bold mb-6">Explore Our Unique Offerings</h2>
              <p>Discover a range of exclusive features designed to elevate your experience. Learn how our distinct
                  offerings can redefine your journey and empower you to accomplish more.</p>
          </div>
          <div className="mt-14">
              <div className="grid md:grid-cols-2 items-center gap-16">
                  <div>
                      <img 
                          src="https://readymadeui.com/image-1.webp"
                          className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                          alt="Illustration of customization options"
                      />
                  </div>
                  <div className="max-w-lg">
                      <h3 className="text-xl font-semibold mb-4">Tailored Customization</h3>
                      <p>Experience unparalleled customization options tailored to suit your unique needs. Our platform provides
                          a wide array of features, ensuring you have the flexibility to personalize your journey.</p>
                      <button 
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                          aria-label="Learn more about Tailored Customization"
                      >
                          Learn More
                      </button>
                  </div>
                  <div className="max-md:order-1 max-w-lg">
                      <h3 className="text-xl font-semibold mb-4">Optimized Performance</h3>
                      <p>Unlock top-notch performance with our advanced optimization techniques. We prioritize speed,
                          efficiency, and reliability to ensure a seamless experience, no matter the complexity of your tasks.</p>
                      <button 
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                          aria-label="Learn more about Optimized Performance"
                      >
                          Learn More
                      </button>
                  </div>
                  <div>
                      <img 
                          src="https://readymadeui.com/contact.webp"
                          className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                          alt="Illustration of performance optimization"
                      />
                  </div>
              </div>
          </div>
      </div>
  );
}

export default DivTwo;