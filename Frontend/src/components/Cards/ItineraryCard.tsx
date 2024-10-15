import React, { useState } from "react";
import { Card, Badge, Row, Col, Image, DropdownButton, Dropdown, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt, faMap } from "@fortawesome/free-solid-svg-icons"; // Import travel-related icons
import "./Cards.css";
import Rating from "../Rating/Rating";
import { useNavigate } from "react-router-dom";

interface InputData {
  id: string;
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
  isTourGuide: boolean;
  onChange?: (newStatus: boolean) => void; // Pass new booking status as parameter
  onClick?: () => void; // Add onClick function
  onDelete?: () => void; // Add onDelete function
}

const ItineraryCard = ({
  id,
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
  isTourGuide,
  onChange,
  onClick,
  onDelete,
}: InputData) => {
  // Manage the state for the booking status
  const [bookingStatus, setBookingStatus] = useState(isActive); // Initialize booking status from props
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle edit action
  const navigate = useNavigate();

  const handleEdit = (itinerary_id: string) => {
    navigate(`/EditItinerary/${itinerary_id}`); // Navigate to the EditProduct page
  };
  

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Perform the delete action here
    onDelete && onDelete(); // Call the onDelete function passed as a prop
    setShowDeleteModal(false); // Close modal after confirming
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without action
  };

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
        <Col md={3} className="p-0 d-flex align-items-stretch" onClick={onClick}>
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
          />
        </Col>

        {/* Main Info Section */}
        <Col md={isTourGuide? 5 : 6} className="d-flex align-items-stretch" onClick={onClick}>
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
          onClick={onClick}
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
            {isTourGuide ? (
            <Badge
              bg={bookingStatus ? "active" : "inactive"} // Change color based on booking status
              className="mt-2 custom-status-badge rounded-4 text-center"
              onClick={handleBookingToggle} // Toggle booking status
            >
              {bookingStatus ? "Booking On" : "Booking Off"}
            </Badge>
            ) : null}
          </div>
        </Col>
        {isTourGuide ?
          <Col md={1} className="d-flex align-items-baseline">
            <DropdownButton
              align="end"
              title="⋮"  // Three-dot symbol
              variant="light"
              className="d-flex justify-content-end ms-3 btn-main-inverse">
              <Dropdown.Item onClick={() => id && handleEdit(id)}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
            </DropdownButton>
          </Col>
          : null}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ItineraryCard;
