import React from "react";
import { Card, Button, Col, Row, Image, Container } from "react-bootstrap";
import { useAppDispatch } from "../../store/hooks";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";
import { addProduct } from "../../store/cartSlice";
import { removeProductFromWishlist } from "../../store/wishlistSlice";
import { FaTrashAlt } from "react-icons/fa";
import { useAppContext } from "../../AppContext";
import { useMemo, useState } from "react";

interface WishlistCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  //onAddToCart: () => void;
  //onRemoveFromWishlist: () => void;
}

const WishlistCard = ({
  id,
  name,
  price,
  description,
  image,
}: //onAddToCart,
//onRemoveFromWishlist,
WishlistCardProps) => {
  // const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(price, baseCurrency, currency);
  }, [price, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

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

  const removeFromWishlist = (e: any, id: any) => {
    e.stopPropagation();
    e.preventDefault();
    showToastMessage("Product removed from Wishlist", ToastTypes.INFO);
    dispatch(removeProductFromWishlist(id)); // Dispatch the action to remove product by id
  };

  return (
    // <Container className="d-flex justify-content-center">
    <Card className=" p-3 shadow-sm mb-5" style={{ borderRadius: "10px" }}>
      <Row className="h-100 d-flex align-items-stretch justify-content-between ps-2">
        {/* Image Section */}
        <Col md={4} className="p-0 d-flex align-items-stretch m-auto">
          <Image
            src={image || "https://via.placeholder.com/250x250"}
            rounded
            alt="Product Image"
            style={{ objectFit: "cover", height: "75%", width: "75%" }}
          />
        </Col>

        {/* Main Info Section */}
        <Col md={5} className="d-flex align-items-stretch">
          <Card.Body className="p-0 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-1">
                <Card.Title
                  className="mb-0"
                  style={{ fontWeight: "bold", marginRight: "10px" }}
                >
                  {name}
                </Card.Title>
              </div>
              <Card.Text className="mt-2">Description: {description}</Card.Text>
            </div>
          </Card.Body>
        </Col>

        {/* Quantity and Remove Button Section */}
        <Col
          md={3}
          className="d-flex flex-column justify-content-between align-items-end"
        >
          <div className="d-flex align-items-center mb-2"></div>
          <h4 style={{ fontWeight: "bold" }}>{convertedPrice}</h4>

          <div
            style={{
              width: "-webkit-fill-available",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className="w-25 "
              variant="main-inverse"
              onClick={addToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="main-inverse"
              className="w-20"
              onClick={(e) => {
                removeFromWishlist(e, id);
              }}
            >
              <FaTrashAlt>Remove</FaTrashAlt>
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default WishlistCard;


