import React, { useState, useMemo } from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import CartCard from "../components/Cards/CartCard";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { TouristService } from "../services/TouristService";

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

  const promoCodes = [
    { code: "SAVE10", discountType: "flat", discountValue: 10 },
    { code: "SAVE20", discountType: "percentage", discountValue: 20 },
  ];


  const handleApplyPromoCode = async () => {
    try {
      let promo = await TouristService.isValidPromoCode(promoCode);

      if (promo.status == 200 && promo.data.valid) {
        promo = promo.data;
        promo = {
          ...promo,
          discountType: "percentage",
        }
        let discountedSubtotal = cart.total;

        if (promo.discountType === "flat") {
          discountedSubtotal -= promo.discountValue;
        } else if (promo.discountType === "percentage") {
          discountedSubtotal -= (cart.total * promo.discount_percent) / 100;
        }

        discountedSubtotal = Math.max(0, discountedSubtotal); // Prevent negative subtotal

        setNewSubtotal(discountedSubtotal);
        setIsPromoApplied(true);
        setPromoError("");
      } else {
        setPromoError("Invalid or Expired Promo Code");
        setIsPromoApplied(false);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
    }
  };



  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const convertedPrice = useMemo(() => {
    const subtotal = isPromoApplied ? newSubtotal : cart.total;
    return getConvertedCurrencyWithSymbol(subtotal, baseCurrency, currency);
  }, [isPromoApplied, newSubtotal, cart.total, baseCurrency, currency, getConvertedCurrencyWithSymbol]);



  return (
    <Container className="cart-page p-3">
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
                    {getConvertedCurrencyWithSymbol(cart.total, baseCurrency, currency)}
                  </h4>
                  <h4 style={{ color: "green" }}>
                    {getConvertedCurrencyWithSymbol(newSubtotal, baseCurrency, currency)}
                  </h4>
                </div>
              ) : (
                <h4>
                  {getConvertedCurrencyWithSymbol(cart.total, baseCurrency, currency)}
                </h4>
              )}
              <Button variant="main-inverse" className="w-100 mb-4" onClick={() => navigate("/ChooseDeliveryAddress")}>Confirm Order </Button>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
