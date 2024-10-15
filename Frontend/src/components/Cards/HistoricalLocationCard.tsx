import {
  Card,
  Badge,
  Row,
  Col,
  Image,
  DropdownButton,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import Rating from "../Rating/Rating";
import "./Cards.css";
import { HistoricalService } from "../../services/HistoricalService";
import { useEffect, useState } from "react";
import { get } from "http";
import { use } from "i18next";
import { useNavigate } from "react-router-dom";
import { on } from "events";

interface InputData {
  id: string;
  Name: string;
  location: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  Price: number;
  image?: string;
  OpeningHourFrom: string; // Using string for time representation
  OpeningHourTo: string; // Using string for time representation
  OpeningDays: string; // New property for opening days
  Description: string; // Fixed typo from Descripition to Description
  isActive: boolean;
  isGoverner: boolean;
  tags?: string[];
  onChange?: () => void; // Change onChange to a function that does not take parameters
  onClick?: () => void;
  onDelete?: () => void;
}

export const HistoricalLocationCard = ({
  id,
  Name,
  location,
  RatingVal,
  Reviews,
  Price,
  OpeningHourFrom,
  OpeningHourTo,
  OpeningDays, // New property
  Description,
  isActive,
  image,
  isGoverner,
  tags,
  onChange,
  onClick,
  onDelete,
}: InputData) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  function handleEdit(id: string): void {
    navigate(`/EditHistoricalLocation/${id}`);
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Perform the delete action here
    onDelete && onDelete(); // Call the onDelete function passed as a prop
    setShowDeleteModal(false); // Close modal after confirming
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without action
  };

  // Manage the state for the rating

  return (
    <Card
      className="p-3 shadow-sm"
      style={{ borderRadius: "10px", height: "100%" }}
    >
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col
          md={2}
          className="p-0 d-flex align-items-stretch"
          onClick={onClick}
        >
          <Image
            src="https://via.placeholder.com/250x250"
            rounded
            alt="Activity Image"
          />
        </Col>

        {/* Main Info Section */}
        <Col
          md={isGoverner ? 6 : 7}
          className="d-flex align-items-stretch"
          onClick={onClick}
        >
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
                {tags?.map((tag, index) => (
                  <Badge
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
                    key={index}
                  >
                    {tag}
                  </Badge>
                ))}
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

              {/* Category, Opening Hours, and Opening Days */}
              <Card.Text className="text-muted">
                Opening Hours: {OpeningHourFrom} - {OpeningHourTo}
              </Card.Text>
              <Card.Text className="text-muted">
                Opening Days: {OpeningDays}
              </Card.Text>
            </div>
            {/* Description */}
            <Card.Text className="text-muted">{Description}</Card.Text>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
          onClick={onClick}
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-3">
            {/* Rating Stars */}
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
          <p className="text-muted text-right" style={{ fontSize: "1.1rem" }}>
            {Reviews.toLocaleString()} Reviews
          </p>

          {/* Booking Badge */}
          <div className="text-right">
            <h4 style={{ fontWeight: "bold" }}>${Price.toFixed(2)}</h4>
            {isGoverner ? (
              <Badge
                bg={isActive ? "active" : "inactive"} // Change color based on booking status
                className="mt-2 custom-status-badge rounded-4 text-center"
                onClick={onChange} // Call onChange when clicked
              >
                {isActive ? "Active" : "InActive"}
              </Badge>
            ) : null}
          </div>
        </Col>
        {isGoverner ? (
          <Col md={1} className="d-flex align-items-baseline">
            <DropdownButton
              align="end"
              title="⋮" // Three-dot symbol
              variant="light"
              className="d-flex justify-content-end ms-3 btn-main-inverse"
            >
              <Dropdown.Item onClick={() => id && handleEdit(id)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
            </DropdownButton>
          </Col>
        ) : null}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
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
