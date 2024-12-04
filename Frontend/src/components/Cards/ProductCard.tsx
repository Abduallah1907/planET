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
import { addProductToWishlist, removeProductFromWishlist } from "../../store/wishlistSlice";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { setWishlist } from "../../store/userSlice";
import { TouristService } from "../../services/TouristService";

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

  const isAdmin = user.role === "ADMIN";
  const isSeller = user.role === "SELLER";
  const wishlisted = user.stakeholder_id.wishlist.includes(id);

  const handleEdit = (product_id: string) => {
    navigate(`/EditProduct/${product_id}`); // Navigate to the EditProduct page
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Perform the delete action here
    setShowDeleteModal(false); // Close modal after confirming
    showToastMessage("Product deleted", ToastTypes.SUCCESS);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false); // Close modal without action
  };
  const dispatch = useAppDispatch();
  const addToCart = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    showToastMessage("Product added to cart", ToastTypes.SUCCESS);
    dispatch(
      addProduct({
        product: { id, name, price, description, image },
        quantity: 1,
      })
    );
  };

  const addToWishlist = async(e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await TouristService.addProductToWishlist(user.email, {
      product_id: id,
    })
    showToastMessage("Product added to Wishlist", ToastTypes.SUCCESS);

    const updatedWishlist = [...user.stakeholder_id.wishlist, id];

    dispatch(
      addProductToWishlist({
        id,
        name,
        price,
        description,
        image,
      })
    );
    dispatch(setWishlist(updatedWishlist));
  };

  const removeFromWishlist = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await TouristService.removeProductFromWishlist(user.email, {
      product_id: id,
    });
    showToastMessage("Product removed from Wishlist", ToastTypes.SUCCESS);

    const updatedWishlist = user.stakeholder_id.wishlist.filter(
      (productId: string) => productId !== id
    );

    dispatch(removeProductFromWishlist(id));

    dispatch(setWishlist(updatedWishlist));
  }

  return (
    <Card
      className="shadow-sm position-relative"
      style={{ borderRadius: "10px", height: "100%" }}
    >
      <Card.Img
        variant="top"
        src={image || "https://via.placeholder.com/250x250"}
        style={{
          height: "200px",
          objectFit: "cover",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      />
      <hr className="m-0" />
      {user.role === "TOURIST" && (
        <div className="wishlist-card-btn">
          <Button
            className="btn-margin m-0 rounded-circle"
            variant=""
            onClick={wishlisted ? removeFromWishlist : addToWishlist}
          >
            {wishlisted ? <FaHeart/> : <FaRegHeart />}
          </Button>
        </div>
      )}

      <Card.Body className="align-content-center d-flex flex-column mt-2">
        <Row className="justify-content-between m-0">
          <Col md={"auto"}>
            {/* Product Name */}
            <Card.Title>
              {name}
            </Card.Title>
          </Col>
          <Col md={"auto"} className="p-0">
            {/* Rating and Reviews */}
            <div className="d-flex align-items-center justify-content-end me-2">
              {/* Rating Stars */}
              <Rating rating={average_rating} readOnly={true} />
              <Badge
                className="ms-2 review-badge text-center"
                style={{ fontSize: "1rem" }}
              >
                {average_rating.toFixed(1)}
              </Badge>
            </div>
          </Col>
        </Row>

        <Row className="m-0">
          <Col md={8}>
            {/* Product Description */}
            <Card.Text className="mt-2">{description}</Card.Text>
          </Col>
          <Col md={4} className="d-flex justify-content-end">
            <p
              className="text-muted text-right"
              style={{ fontSize: "1.1rem", fontWeight: "500" }}
            >
              {Reviews} Reviews
            </p>

          </Col>
        </Row>

        <Row className="mb-2 m-0">
          <Card.Text className="text-muted">
            {isSeller || isAdmin
              ? `Sales: ${sales} | Quantity: ${quantity}`
              : `Quantity: ${quantity}`}
          </Card.Text>
        </Row>
        {/* Created and Updated Date */}
        {/* {(isSeller || isAdmin) && (
              <Card.Text className="text-muted">
                Created: {createdAt.toLocaleDateString()} | Updated:{" "}
                {updatedAt.toLocaleDateString()}
              </Card.Text>
            )} */}
        <Row className="mt-auto m-0">
          <Col>
            <h4 className="m-0" style={{ fontWeight: "bold" }}>{convertedPrice}</h4>
          </Col>
          <Col>
            {/* Show Active/Archive button if the user is the seller */}
            {isSeller || isAdmin ? (
              <div className="d-flex justify-content-end">
                <Badge
                  bg={!isActiveArchive ? "active" : "inactive"}
                  className="custom-status-badge rounded-4 text-center"
                  onClick={onChange}
                  style={{ cursor: "pointer" }}
                >
                  {!isActiveArchive ? "Active" : "Archived"}
                </Badge>
              </div>
            ) : (
              <div className="d-flex justify-content-end">
                {user.role === "TOURIST" && (
                  <Button
                    className="m-0"
                    variant="main-inverse"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>

      {/* Rating, Reviews, Price Section */}

      {isSeller || isAdmin ? (
        <div className="dropdown-card-btn">
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
        </div>
      ) : null}

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
