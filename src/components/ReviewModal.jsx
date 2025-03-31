import React, { useState, useEffect } from 'react';
import { X, Check, Star, Send, Loader } from 'lucide-react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, booking }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [fetchingProvider, setFetchingProvider] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && booking) {
      setRating(0);
      setReview('');
      setSuccess(false);
      setError(null);
      fetchProviderDetails();
    }
  }, [isOpen, booking]);
  
  const fetchProviderDetails = async () => {
    if (!booking || !booking.providerEmail) return;
    
    try {
      setFetchingProvider(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `/api/profile/getUserInfo`,
        { email: booking.providerEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setProviderId(response.data.id);
      setFetchingProvider(false);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      setError('Failed to load provider information');
      setFetchingProvider(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!providerId) {
      setError('Provider information is missing. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const reviewData = {
        providerID: providerId,
        review,
        rating,
        serviceType: booking.service
      };
      
      await axios.post(
        `/reviews/addReview`, 
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div 
        className={`relative bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl transition-all duration-300 ease-out ${
          animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Close review modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h3 id="review-modal-title" className="text-xl font-semibold text-white">
            Rate your experience
          </h3>
          <p className="text-gray-400 mt-1">
            Share your feedback about {booking?.providerName || "this service"}
          </p>
        </div>

        {fetchingProvider ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader className="h-10 w-10 text-indigo-400 animate-spin mb-4" aria-hidden="true" />
            <p className="text-gray-400">Loading provider information...</p>
          </div>
        ) : success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Thank you!</h4>
            <p className="text-gray-400">Your review has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating stars */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Your Rating
              </label>
              <div 
                className="flex justify-center"
                role="radiogroup"
                aria-labelledby="rating-label"
              >
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`p-1 transform transition-all duration-200 ${
                        (hoverRating || rating) >= star 
                          ? 'text-yellow-400 scale-110' 
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                      aria-checked={rating === star}
                      role="radio"
                      aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    >
                      <Star 
                        className="h-8 w-8 fill-current" 
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
              {rating > 0 && (
                <p className="text-center text-gray-400 mt-2 animate-fadeIn">
                  {rating === 5 ? "Excellent!" : 
                   rating === 4 ? "Very Good" : 
                   rating === 3 ? "Good" : 
                   rating === 2 ? "Fair" : "Poor"}
                </p>
              )}
            </div>

            {/* Review text */}
            <div>
              <label htmlFor="review" className="block text-gray-300 text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="review"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your experience with this service..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                aria-describedby="review-description"
              />
              <p id="review-description" className="sr-only">
                Please provide detailed feedback about your experience
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div 
                className="p-3 bg-red-900/40 border border-red-800 rounded-lg text-red-400 text-sm animate-fadeIn"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !providerId}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-70"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* Footer with service info */}
        <div className="bg-gray-950 p-4 rounded-b-2xl border-t border-gray-800">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" aria-hidden="true"></div>
            <span>Service: {booking?.service || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;