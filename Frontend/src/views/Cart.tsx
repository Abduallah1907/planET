import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import CartCard from "../components/Cards/CartCard";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import showToastMessage from "@/utils/showToastMessage";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CartPage: React.FC = () => {
  const cart = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const cartItems: CartItem[] = cart.products;

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [oldSubtotal, setOldSubtotal] = useState(cart.total);
  const [newSubtotal, setNewSubtotal] = useState(cart.total);
  const [promoError, setPromoError] = useState("");


  const handleApplyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setNewSubtotal(oldSubtotal - 10); // Example: $10 discount
      setIsPromoApplied(true);
      setPromoError(""); // Clear error if the promo code is valid
    } else {
      setPromoError("Invalid or Expired Promo Code");
      setIsPromoApplied(false);
    }
  };

  return (
    <div className="cart-page p-3">
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Your Cart
          </h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {cartItems.map((item, index) => (
            <CartCard
              key={item.product.id}
              index={index}
              id={item.product.id}
              name={item.product.name}
              price={item.product.price}
              description={item.product.description}
              quantity={item.quantity}
              image={item.product.image}
            />
          ))}
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Enter Promo Code</h5>
              <Row>
                <Col md={8}>
                  <input
                    type="text"
                    className="form-control my-3 border"
                    placeholder="Enter Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    aria-label="Promo Code Input"
                  />
                  {promoError && <small className="text-danger">{promoError}</small>}
                </Col>
                <Col md={4}>
                  <Button
                    variant="main"
                    className="w-75 my-3 border-warning-subtle"
                    onClick={handleApplyPromoCode}
                    aria-label="Apply Promo Code"
                  >
                    Apply
                  </Button>
                </Col>
              </Row>

              <h5 className="mt-4">Subtotal</h5>
              {isPromoApplied ? (
                <div>
                  <h4 style={{ textDecoration: "line-through", color: "gray" }}>
                    ${cart.total.toFixed(2)}
                  </h4>
                  <h4 style={{ color: "green" }}>${newSubtotal.toFixed(2)}</h4>
                </div>
              ) : (
                <h4>${cart.total.toFixed(2)}</h4>
              )}

              <Button
                variant="main-inverse"
                className="w-100 mb-4 mt-3"
                onClick={() => navigate("/ProductPayment")}
                aria-label="Confirm Order"
              >
                Confirm Order
              </Button>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
