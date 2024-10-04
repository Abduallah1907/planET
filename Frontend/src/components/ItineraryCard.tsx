import React, { useState } from "react";
import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt, faMap } from "@fortawesome/free-solid-svg-icons"; // Import travel-related icons
import Rating from "react-rating";
import "./ActivityCard.css";

interface InputData {
  locations: string;
  pickup: string;
  dropoff: string;
  Languages: string;
  accessibility: boolean;
  Rating: number; // Initial Rating
  Reviews: number;
  Price: number;
  Duration: string;
  Available_Dates: Date;
  isActive: boolean;
  isBooked: boolean;
  onChange?: (newStatus: boolean) => void; // Pass new booking status as parameter
}

const ItineraryCard = ({
  locations,
  pickup,
  dropoff,
  Languages,
  accessibility,
  Rating: initialRating,
  Reviews,
  Price,
  Duration,
  Available_Dates,
  isActive,
  isBooked,
  onChange,
}: InputData) => {
  // Manage the state for the rating
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [bookingStatus, setBookingStatus] = useState(isBooked); // Handle booking status

  // Toggle booking status
  const handleBookingToggle = () => {
    const newStatus = !bookingStatus;
    setBookingStatus(newStatus);
    if (onChange) {
      onChange(newStatus);
    }
  };

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
                {/* Badges next to Activity Name */}
                <Badge pill bg="tag" className="me-2 custom-badge">
                  Outdoor
                </Badge>
                <Badge pill bg="tag" className="custom-badge">
                  Nightlife
                </Badge>
              </div>
              <Card.Text>
                <a
                  href="#"
                  className="text-danger"
                  style={{ fontSize: "0.9rem" }}
                >
                  {locations} • Show on map
                </a>
              </Card.Text>

              {/* Pickup, Dropoff, Languages, and Accessibility */}
              <Card.Text className="text-muted">
                Pickup: {pickup} • Dropoff: {dropoff}
              </Card.Text>
              <Card.Text className="text-muted">Languages: {Languages}</Card.Text>
              <Card.Text className="text-muted d-flex align-items-center">
                Accessibility:{" "}
                {accessibility ? (
                  <FontAwesomeIcon
                    icon={faMapMarkedAlt} // Use the tour-related icon (map or marker)
                    className="ms-2 text-success"
                  />
                ) : (
                  "No"
                )}
              </Card.Text>

              {/* Date and Duration */}
              <Card.Text className="text-muted">
                {Available_Dates.toLocaleDateString()} • Duration: {Duration}
              </Card.Text>
            </div>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
        >
          {/* Rating and Reviews */}
          <div className="d-flex align-items-center justify-content-end mb-1">
            <Rating
              emptySymbol="far fa-star" // Font Awesome empty star
              fullSymbol="fas fa-star" // Font Awesome filled star
              fractions={2} // Allows half-star ratings
              initialRating={currentRating}
              onChange={(newRating) => setCurrentRating(newRating)} // Update the rating state on change
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
              bg={bookingStatus ? "success" : "danger"} // Change color based on booking status
              className="mt-2 custom-status-badge rounded-4 text-center"
              onClick={handleBookingToggle} // Toggle booking status
            >
              {bookingStatus ? "Booking On" : "Booking Off"}
            </Badge>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ItineraryCard;
