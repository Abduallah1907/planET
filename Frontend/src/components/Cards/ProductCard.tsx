import { Card, Badge, Row, Col, Image } from "react-bootstrap";
import "./Cards.css";
import Rating from "../Rating/Rating";

interface InputData {
  Name: string;
  id: string;
  average_rating: number;
  Reviews: number;
  sales: number;
  quantity: number;
  price: number;
  description: string;
  isActiveArchive: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  onChange?: () => void;
  isSeller: boolean; // Check if the user is the seller
}

const ProductCard = ({
  Name,
  average_rating,
  Reviews,
  price,
  description,
  quantity,
  sales,
  isActiveArchive,
  imageUrl,
  createdAt,
  updatedAt,
  onChange,
  isSeller,
}: InputData) => {
  // Determine if the product is active or archived
  const isBooked = isActiveArchive;

  return (
    <Card className="p-3 shadow-sm" style={{ borderRadius: "10px", height: "100%" }}>
      <Row className="h-100 d-flex align-items-stretch justify-content-between">
        {/* Image Section */}
        <Col md={2} className="p-0 d-flex align-items-stretch">
          <Image
            src={imageUrl || "https://via.placeholder.com/250x250"} 
            rounded
            alt="Product Image"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col md={7} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                {/* Product Name */}
                <Card.Title className="mb-0" style={{ fontWeight: "bold", marginRight: "10px" }}>
                  {Name}
                </Card.Title>
              </div>

              {/* Product Description */}
              <Card.Text className="mt-2">Description: {description}</Card.Text>
              <Card.Text className="text-muted">
                Sales: {sales} | Quantity: {quantity}
              </Card.Text>
            </div>
            <Card.Text className="text-muted">
              Created: {createdAt.toLocaleDateString()} | Updated: {updatedAt.toLocaleDateString()}
            </Card.Text>
          </Card.Body>
        </Col>

        {/* Rating, Reviews, Price Section */}
        <Col md={3} className="d-flex flex-column justify-content-between align-items-end">
          {/* Rating and Reviews */}
          <div className="d-flex align-items-center justify-content-end mb-1">
            {/* Rating Stars */}
            <Rating rating={average_rating} readOnly={true} />
            <Badge className="ms-2 review-badge text-center" style={{ fontSize: "1rem" }}>
              {average_rating.toFixed(1)}
            </Badge>
          </div>
          <p className="text-muted text-right" style={{ fontSize: "1.1rem", fontWeight: "500" }}>
            {Reviews} Reviews
          </p>

          
          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>${price.toFixed(2)}</h4>

            {/* Show Active/Archive button if the user is the seller */}
            {isSeller && (
              <Badge
                bg={isBooked ? "success" : "danger"}
                className="mt-2 custom-status-badge rounded-4 text-center"
                onClick={onChange} 
                style={{ cursor: "pointer" }}
              >
                {isBooked ? "Active" : "Archive"}
              </Badge>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductCard;
