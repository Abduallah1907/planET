import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import Rating from '../Rating/Rating';
import "./Cards.css";

interface InputData {
  Name: string;
  location: string;
  category: string;
  RatingVal: number; // Initial Rating
  Reviews: number;
  NativePrice: number;
  ForeignPrice: number;
  StudentPrice: number;
  imageUrl:string;
  OpeningHourFrom: string; // Using string for time representation
  OpeningHourTo: string; // Using string for time representation
  OpeningDays: string; // New property for opening days
  Description: string; // Fixed typo from Descripition to Description
  isActive: boolean;
  isBooked: boolean; // Added isBooked prop
  onChange?: () => void; // Change onChange to a function that does not take parameters
}

const HistoricalLocationCard = ({
  Name,
  location,
  category,
  RatingVal,
  Reviews,
  NativePrice,
  ForeignPrice,
  StudentPrice,
  OpeningHourFrom,
  OpeningHourTo,
  OpeningDays, // New property
  Description,
  isActive,
  isBooked,
  imageUrl,
  onChange,
}: InputData) => {
  // Manage the state for the rating

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
                  Historical
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

              {/* Category, Opening Hours, and Opening Days */}
              <Card.Text className="text-muted">Category: {category}</Card.Text>
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
        >
          {/* Rating and Reviews on the Far Right */}
          <div className="d-flex align-items-center justify-content-end mb-3">
            {/* Rating Stars */}
            <Rating
              rating={RatingVal}
              readOnly={true}
            />
            <Badge
              className="ms-2 review-badge text-center"
              style={{
                fontSize: "1rem",
              }}
            >
              {RatingVal.toFixed(1)}
            </Badge>
          </div>
          <p className="text-muted text-right" style={{ fontSize: "0.9rem" }}>
            {Reviews.toLocaleString()} Reviews
          </p>

          {/* Price Display */}
          <div className="text-right">
            <h6 style={{ fontWeight: "bold" }}>Prices:</h6>
            <p className="mb-1">Native Price: ${NativePrice.toFixed(2)}</p>
            <p className="mb-1">Foreign Price: ${ForeignPrice.toFixed(2)}</p>
            <p className="mb-1">Student Price: ${StudentPrice.toFixed(2)}</p>
          </div>

          {/* Booking Badge */}
          <div className="text-right">
            <Badge
              bg={isBooked ? "danger" : "success"} // Change color based on booking status
              className="mt-2 clickable-badge"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={onChange} // Call onChange when clicked
            >
              {isBooked ? "Booking Off" : "Book Now"}
            </Badge>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default HistoricalLocationCard;
