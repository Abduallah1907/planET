import React, { useState } from "react";
import './Rating.css';

interface RatingProps {
  rating?: number; // Decimal rating, e.g., 3.7
  totalStars?: number; // Total number of stars, default is 5
  onChange?: (newRating: number) => void; // Callback when rating is changed
  readOnly?: boolean; // Flag to make the rating read-only
}

const Rating: React.FC<RatingProps> = ({ rating = 0, totalStars = 5, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null); // For handling hover effect

  const handleClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onChange) return; // Do nothing if read-only
    // Determine if the click is on the left or right half of the star
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left; // Get the X position relative to the star
    const halfStar = clickX < width / 2 ? 0.5 : 1; // Determine if it's left or right side of the star
    const newRating = index - 1 + halfStar; // Calculate the new rating based on index and half-star
    console.log(newRating);
    setHoverRating(newRating); // Set the hover rating when a star is clicked
    onChange(newRating); // Call the onChange callback with the selected rating
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return; // Do nothing if read-only
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left; // Get the X position relative to the star
    const halfStar = clickX < width / 2 ? 0.5 : 1; // Determine if it's left or right side of the star
    const newRating = index - 1 + halfStar; // Calculate the new rating based on index and half-star
    setHoverRating(newRating); // Set the hover rating when the mouse enters a star
  };

  const handleMouseLeave = () => {
    if (readOnly) return; // Do nothing if read-only
    setHoverRating(null); // Reset hover rating when the mouse leaves the star
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      // Determine if the current star is filled based on the hover state or the selected rating
      const fillPercentage = Math.min(Math.max((hoverRating ?? rating) - i + 1, 0), 1) * 100;

      stars.push(
        <div
          key={i}
          className={`star ${readOnly ? 'read-only' : ''}`} // Add read-only class if necessary
          onClick={(event) => !readOnly && handleClick(i, event)} // Disable click if read-only
          onMouseMove={(event) => !readOnly && handleMouseMove(i, event)} // Track mouse movement for hover
          onMouseLeave={() => !readOnly && handleMouseLeave()} // Disable hover if read-only
        >
          <div className="star-fill" style={{ width: `${fillPercentage}%` }}></div>
        </div>
      );
    }

    return stars;
  };

  return <div className="rating">{renderStars()}</div>;
};

export default Rating;