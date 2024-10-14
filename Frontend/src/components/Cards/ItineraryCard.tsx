import React, { useState } from "react";
import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt, faMap } from "@fortawesome/free-solid-svg-icons"; // Import travel-related icons
import "./Cards.css";
import Rating from "../Rating/Rating";

interface InputData {
  name: string;
  comments: string;
  timeline: string;
  locations: string;
  pickup_loc: string;
  drop_off_loc: string;
  Languages: string;
  accessibility: boolean;
  RatingVal: number; // Initial Rating
  Reviews: number;
  Price: number;
  Duration: string;
  Available_Dates: Date[];
  isActive: boolean;
  tags?: any; // Add tags property
  onChange?: (newStatus: boolean) => void; // Pass new booking status as parameter
}

const ItineraryCard = ({
  name,
  comments,
  timeline,
  locations,
  pickup_loc,
  drop_off_loc,
  Languages,
  accessibility,
  RatingVal,
  Reviews,
  Price,
  Duration,
  Available_Dates,
  isActive,
  tags,
  onChange,
}: InputData) => {
  // Manage the state for the booking status
  const [bookingStatus, setBookingStatus] = useState(isActive); // Initialize booking status from props

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
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col md={3} className="p-0 d-flex align-items-stretch">
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
          />
        </Col>

        {/* Main Info Section */}
        <Col md={6} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                <h5>{name}</h5>
                {/* Badges next to Activity Name */}
                {tags?.map((tag:any, index:any) => (
                  <Badge pill bg="tag" className="me-2 custom-badge" key={index}>
                    {tag.type}
                  </Badge>
                ))}
              </div>
              <Card.Text className="text-muted mb-2">
                {comments}
              </Card.Text>
              <Card.Text className="text-muted">
                Timeline: {timeline}
              </Card.Text>

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
                Pickup: {pickup_loc} • Dropoff: {drop_off_loc}
              </Card.Text>
              <Card.Text className="text-muted">
                Languages: {Languages}
              </Card.Text>
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
              {Available_Dates.map(date => date.toString().split('T')[0]).join(", ")} • Duration: {Duration}
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
            <Rating rating={RatingVal} readOnly={true} />
            <Badge
              className="ms-2 review-badge text-center"
              style={{
                fontSize: "1rem",
              }}
            >
              {RatingVal.toFixed(1)}
            </Badge>
          </div>
          <p
            className="text-muted text-right"
            style={{ fontSize: "1.1rem", fontWeight: "500" }}
          >
            {Reviews} Reviews
          </p>

          {/* Price and Active/Inactive Button */}
          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>${Price.toFixed(2)}</h4>
            <Badge
              bg={bookingStatus ? "active" : "inactive"} // Change color based on booking status
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
