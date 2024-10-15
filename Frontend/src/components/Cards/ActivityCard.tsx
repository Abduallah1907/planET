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
import "./Cards.css";
import Rating from "../Rating/Rating";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface InputData {
  Name: string;
  location: string;
  category: string;
  tags?: string[];
  id?: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  Price: number;
  Date_Time: Date;
  isActive: boolean;
  isBooked: boolean; // Added isBooked prop
  image?: string;
  onChange?: () => void; // Change onChange to a function that does not take parameters
  onClick?: () => void;
  onDelete?: () => void;
  isAdvertiser: boolean;
}

const CustomActivityCard = ({
  id,
  Name,
  location,
  category,
  tags,
  RatingVal,
  Reviews,
  Price,
  Date_Time,
  isActive,
  isBooked,
  onChange,
  onClick,
  onDelete,
  isAdvertiser,
}: InputData) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Manage the state for the rating
  const navigate = useNavigate();
  const handleEdit = (activity_id: string) => {
    navigate(`/EditActivity/${activity_id}`); // Navigate to the EditProduct page
  };

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
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col
          md={isAdvertiser ? 6 : 7}
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

                {(tags || []).map((tag, index) => (
                  <Badge
                    key={index}
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
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
          onClick={onClick}
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-1">
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
          <p
            className="text-muted text-right"
            style={{ fontSize: "1.1rem", fontWeight: "500" }}
          >
            {Reviews.toLocaleString()} Reviews
          </p>

          {/* Price and Active/Inactive Button */}
          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>${Price.toFixed(2)}</h4>
            {isAdvertiser ? (
              <Badge
                bg={isActive && isBooked ? "active" : "inactive"} // Change color based on booking status
                className="mt-2 custom-status-badge rounded-4 text-center"
                onClick={onChange} // Call onChange when clicked
              >
                {!isActive
                  ? "Inactive"
                  : isBooked
                  ? "Booking On"
                  : "Booking Off"}
              </Badge>
            ) : null}
          </div>
        </Col>
        {isAdvertiser ? (
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

export default CustomActivityCard;
