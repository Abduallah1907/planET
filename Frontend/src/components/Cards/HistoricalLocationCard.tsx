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
  Placeholder,
} from "react-bootstrap";
import Rating from "../Rating/Rating";
import "./Cards.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";

interface InputData {
  id: string;
  Name: string;
  location: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  image?: string;
  Price?: number;
  nativePrice?: number;
  foreignPrice?: number;
  studentPrice?: number;
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
  nativePrice,
  foreignPrice,
  studentPrice,
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
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(Price ?? 0, baseCurrency, currency);
  }, [Price, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const convertedNativePrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(nativePrice ?? 0, baseCurrency, currency);
  }, [nativePrice, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const convertedForeignPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(foreignPrice ?? 0, baseCurrency, currency);
  }, [foreignPrice, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const convertedStudentPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(studentPrice ?? 0, baseCurrency, currency);
  }, [studentPrice, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

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
  const isBlobUrl = (url: string) => /^blob:/.test(url);

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
          {image && !isBlobUrl(image) ?
            (
              <Placeholder as="div" animation="glow" size="lg" className="w-100">
                <Placeholder xs={12} className="h-100 rounded" />
              </Placeholder>
            )
            :
            (
              <Image
                src={image || "https://via.placeholder.com/250x250"}
                rounded
                alt="Historical location Image"
              />
            )}
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
          <div className="text-end">
            {isGoverner ? (
              <>
                {nativePrice && foreignPrice && studentPrice && (
                  <>
                    <p>Native Price: {convertedNativePrice}</p>
                    <p>Foreign Price: {convertedForeignPrice}</p>
                    <p>Student Price: {convertedStudentPrice}</p>
                  </>
                )}
                <Badge
                  bg={isActive ? "active" : "inactive"} // Change color based on booking status
                  className="mt-2 custom-status-badge rounded-4 text-center"
                  onClick={onChange} // Call onChange when clicked
                >
                  {isActive ? "Active" : "InActive"}
                </Badge>
              </>
            ) : (Price !== undefined ? <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4> : null)}
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
        <Modal.Body>Are you sure you want to delete this historical location ?</Modal.Body>
        <Modal.Footer>
          <Button variant="main" className="border-warning-subtle" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="main-inverse" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};
