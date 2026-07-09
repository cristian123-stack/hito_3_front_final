import React from 'react';

const StarRating = ({ rating = 0, reviews = null }) => {
  return (
    <div className="flex items-center gap-xs">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined text-sm ${star <= Math.round(rating) ? 'text-yellow-500' : 'text-outline-variant'}`}
          style={{ fontVariationSettings: star <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
      {reviews !== null && (
        <span className="text-on-surface-variant font-body-sm text-body-sm">({reviews})</span>
      )}
    </div>
  );
};

export default StarRating;
