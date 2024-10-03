import React, { useState } from "react";
import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import "./ActivityCard.css";
import Rating from "react-rating";

interface InputData {
  Name: string;
  location: string;
  category: string;
  Rating: number; // Initial Rating
  Reviews: number;
  Price: number;
  Date_Time: Date;
  isActive: boolean;
  isBooked: boolean; // Added isBooked prop
  onChange?: () => void; // Change onChange to a function that does not take parameters
}

const CustomActivityCard = ({
  Name,
  location,
  category,
  Rating: initialRating,
  Reviews,
  Price,
  Date_Time,
  isActive,
  isBooked,
  onChange,
}: InputData) => {
  // Manage the state for the rating
  const [currentRating, setCurrentRating] = useState(initialRating);

  return (
    <Card
      className="p-3 shadow-sm"
      style={{ borderRadius: "10px", height: "100%" }}
    >
      <Row className="h-100 d-flex align-items-stretch justify-content-between">
        {/* Image Section */}
        <Col md={2} className="p-0 d-flex align-items-stretch">
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col md={7} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                {/* Activity Name */}
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {Name}
                </Card.Title>
                {/* Badges next to Activity Name */}
                <Badge pill bg="primary" className="me-2 custom-badge">
                  Outdoor
                </Badge>
                <Badge pill bg="secondary" className="custom-badge">
                  Nightlife
                </Badge>
              </div>
              <Card.Text>
                <a
                  href="#"
                  className="text-danger"
                  style={{ fontSize: "0.9rem" }}
                >
                  {location} • Show on map
                </a>
              </Card.Text>

              {/* Category and Date/Time */}
              <Card.Text className="text-muted">Category: {category}</Card.Text>
              <Card.Text className="text-muted">
                {Date_Time.toLocaleDateString()} <br />
                {Date_Time.toLocaleTimeString()}
              </Card.Text>
            </div>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-1">
            {/* Rating Stars */}
            <Rating
              emptySymbol="far fa-star" // Font Awesome empty star
              fullSymbol="fas fa-star" // Font Awesome filled star
              fractions={2} // Allows half-star ratings
              initialRating={currentRating}
              //onChange={(newRating) => setCurrentRating(newRating)} // Update the rating state on change
            />
            <Badge
              className="ms-2 review-badge text-center"
              style={{
                fontSize: "1rem",
              }}
            >
              {currentRating.toFixed(1)}
            </Badge>
          </div>
          <p
            className="text-muted text-right"
            style={{ fontSize: "1.1rem", fontWeight: "500" }}
          >
            {Reviews.toLocaleString()} Reviews
          </p>

          {/* Price and Active/Inactive Button */}
          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>${Price.toFixed(2)}</h4>
            <Badge
              bg={isBooked ? "success" : "danger"} // Change color based on booking status
              className="mt-2 custom-status-badge rounded-4 text-center"
              onClick={onChange} // Call onChange when clicked
            >
              {isBooked ? "Booking On" : "Booking Off"}
            </Badge>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomActivityCard;
