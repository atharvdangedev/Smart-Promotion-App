/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (selectedRating) => {
        onRatingChange(selectedRating);
    };

    return (
        <div className="d-flex align-items-center">
            <div className="d-flex me-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0 me-1"
                        style={{ transition: 'transform 0.15s ease-in-out' }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleStarClick(star)}
                        aria-label={`Rate ${star} stars`}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Star
                            size={24}
                            strokeWidth={2}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.15s ease-in-out',
                                fill: star <= (hoverRating || rating) ? '#ffc107' : 'transparent',
                                color: star <= (hoverRating || rating) ? '#ffc107' : '#dee2e6'
                            }}
                        />
                    </button>
                ))}
            </div>
            <small className="text-muted">
                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
            </small>
        </div>
    );
};

export default StarRating;