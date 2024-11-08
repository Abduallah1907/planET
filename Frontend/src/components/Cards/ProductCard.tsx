import {
  Card,
  Badge,
  Row,
  Col,
  Image,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
} from "react-bootstrap";
import "./Cards.css";
import Rating from "../Rating/Rating";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addProduct } from "../../store/cartSlice";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface InputData {
  name: string;
  id: string;
  average_rating: number;
  Reviews: number;
  sales: number;
  quantity: number;
  price: number;
  description: string;
  isActiveArchive: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  onChange?: () => void;
  onClick?: () => void;
  isSeller: boolean;
  isAdmin: boolean; // Check if the user is the seller
}

const ProductCard = ({
  id,
  name,
  average_rating,
  Reviews,
  price,
  description,
  quantity,
  sales,
  isActiveArchive,
  image,
  createdAt,
  updatedAt,
  onChange,
  onClick,
  isSeller,
  isAdmin,
}: InputData) => {
  // Determine if the product is active or archived
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(price, baseCurrency, currency);
  }, [price, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  // Function to handle edit action
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const handleEdit = (product_id: string) => {
    navigate(`/EditProduct/${product_id}`); // Navigate to the EditProduct page
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Perform the delete action here
    setShowDeleteModal(false); // Close modal after confirming
    // showToast("Product deleted",ToastTypes.SUCCESS);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without action
  };
  const dispatch = useAppDispatch();
  const addToCart = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // showToast("Product added to cart",ToastTypes.SUCCESS);
    dispatch(
      addProduct({
        product: { id, name, price, description, image },
        quantity: 1,
      })
    );
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
            src={image || "https://via.placeholder.com/250x250"}
            rounded
            alt="Product Image"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col
          md={isSeller || isAdmin ? 6 : 7}
          className="d-flex align-items-stretch"
          onClick={onClick}
        >
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                {/* Product Name */}
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {name}
                </Card.Title>
              </div>

              {/* Product Description */}
              <Card.Text className="mt-2">Description: {description}</Card.Text>
              <Card.Text className="text-muted">
                {isSeller || isAdmin
                  ? `Sales: ${sales} | Quantity: ${quantity}`
                  : `Quantity: ${quantity}`}
              </Card.Text>
            </div>
            {/* Created and Updated Date */}
            {(isSeller || isAdmin) && (
              <Card.Text className="text-muted">
                Created: {createdAt.toLocaleDateString()} | Updated:{" "}
                {updatedAt.toLocaleDateString()}
              </Card.Text>
            )}
            {user.role === "TOURIST" && (
              <div className="d-flex justify-content-center">
                <Button
                  className="w-25 "
                  variant="main-inverse"
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
              </div>
            )}
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
            {/* Rating Stars */}
            <Rating rating={average_rating} readOnly={true} />
            <Badge
              className="ms-2 review-badge text-center"
              style={{ fontSize: "1rem" }}
            >
              {average_rating.toFixed(1)}
            </Badge>
          </div>
          <p
            className="text-muted text-right"
            style={{ fontSize: "1.1rem", fontWeight: "500" }}
          >
            {Reviews} Reviews
          </p>

          <div className="text-end">
            <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4>

            {/* Show Active/Archive button if the user is the seller */}
            {isSeller || isAdmin ? (
              <Badge
                bg={!isActiveArchive ? "active" : "inactive"}
                className="mt-2 custom-status-badge rounded-4 text-center"
                onClick={onChange}
                style={{ cursor: "pointer" }}
              >
                {!isActiveArchive ? "Active" : "Archived"}
              </Badge>
            ) : null}
          </div>
        </Col>
        {isSeller || isAdmin ? (
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
          <Button
            variant="main"
            className="border-warning-subtle"
            onClick={cancelDelete}
          >
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

export default ProductCard;
