import React, { useMemo, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt, faMap } from "@fortawesome/free-solid-svg-icons"; // Import travel-related icons
import "./Cards.css";
import Rating from "../Rating/Rating";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { useAppSelector } from "../../store/hooks";
import { ItineraryService } from "../../services/ItineraryService";

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
  onFlag?: () => void; // Add onFlag function
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
  onFlag,
}: InputData) => {
  // Manage the state for the booking status
  const [bookingStatus, setBookingStatus] = useState(isActive); // Initialize booking status from props
  const [showFlagModal, setShowFlagModal] = useState(false); // State for flag confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(Price, baseCurrency, currency);
  }, [Price, baseCurrency, currency]);

  const user = useAppSelector((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

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

  const handleFlag = () => {
    setShowFlagModal(true); // Show flag confirmation modal
  };

  const confirmFlag = async () => {
    await ItineraryService.flagInappropriate(id); // Call the flagInappropriate function from the service
    setShowFlagModal(false); // Close modal after confirming
    onFlag && onFlag(); // Call the onFlag function passed as a prop
  };

  const cancelFlag = () => {
    setShowFlagModal(false); // Close modal without action
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
        <Col
          md={3}
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
          md={isTourGuide || isAdmin ? 5 : 6}
          className="d-flex align-items-stretch"
          onClick={onClick}
        >
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {name}
                </Card.Title>
                {/* Badges next to Activity Name */}
                {tags?.map((tag: any, index: any) => (
                  <Badge
                    pill
                    bg="tag"
                    className="me-2 custom-badge"
                    key={index}
                  >
                    {tag.type}
                  </Badge>
                ))}
              </div>
              <Card.Text className="text-muted mb-2">{comments}</Card.Text>
              <Card.Text className="text-muted">Timeline: {timeline}</Card.Text>

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
                {Available_Dates.map(
                  (date) => date.toString().split("T")[0]
                ).join(", ")}{" "}
                • Duration: {Duration}
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
            <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4>
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
        {isTourGuide || isAdmin ? (
          <Col md={1} className="d-flex align-items-baseline">
            <DropdownButton
              align="end"
              title="⋮" // Three-dot symbol
              variant="light"
              className="d-flex justify-content-end ms-3 btn-main-inverse"
            >
              {isTourGuide ? (
                <>
                  <Dropdown.Item onClick={() => id && handleEdit(id)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item onClick={() => id && handleFlag()}>
                  Flag Innaproprite
                </Dropdown.Item>
              )}
            </DropdownButton>
          </Col>
        ) : null}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Itinerary</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Itinerary?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Flag Confirmation Modal */}
      <Modal show={showFlagModal} onHide={cancelFlag} centered>
        <Modal.Header closeButton>
          <Modal.Title>Flag Inappropriate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to flag this Itinerary as inappropriate?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelFlag}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmFlag}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ItineraryCard;
