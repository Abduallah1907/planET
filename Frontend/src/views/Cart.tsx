import React, { useState, useMemo } from "react";
import { Row, Col, Card, Button, Container, Image, Modal } from "react-bootstrap";
import CartCard from "../components/Cards/CartCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { TouristService } from "../services/TouristService";
import { addPromoCode } from "../store/cartSlice";
import './cart.css'
import { set } from "date-fns";

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

  const [productsModal, setProductsModal] = useState(false);

  const dispatch = useAppDispatch();

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
          dispatch(addPromoCode({
            promoCode,
            discountPercent: promo.discount_percent,
          }));
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

  const [havePromoCode, setHavePromoCode] = useState(false);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      setProductsModal(true);
      return;
    }
    navigate("/ProductPayment");
  }

  return (
    <Container className="cart-page p-3">
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Your Cart
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          {cartItems.length > 0 && cartItems.map((item, index) => (
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
          {cartItems.length === 0 && (
            <Card className="shadow-sm p-3">
              <Card.Body>
                <h4 className="text-center">Your cart is empty</h4>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={4}>
          <Card className="shadow-sm cart-summary">
            <Card.Header className="bg-white mt-2">
              <h4 className="fw-bold">Order Summary</h4>
            </Card.Header>
            <Card.Body className="p-0 pt-3">
              <Container className="px-4">
                <Row onClick={() => setHavePromoCode(!havePromoCode)}>
                  <Col xs={10}>
                    <span className="have-promo-code">Do you have a Promo Code?</span>
                  </Col>
                  <Col xs={2}>
                    <span className={`promo-accordian ${havePromoCode ? 'active' : ''}`}>
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </Col>
                </Row>
                <Row className={`mt-1 ${havePromoCode ? '' : 'd-none'}`}>
                  <Col md={8} className="pe-0">
                    <input
                      type="text"
                      className="form-control my-3 mt-1 border"
                      placeholder="Enter Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      aria-label="Promo Code Input"
                    />
                    {promoError && <small className="text-danger">{promoError}</small>}
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="main-inverse"
                      className="w-100 my-3 mt-1 rounded-5"
                      onClick={handleApplyPromoCode}
                      aria-label="Apply Promo Code"
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
                <ul className="mt-3">
                  <li className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>
                      {getConvertedCurrencyWithSymbol(cart.total, baseCurrency, currency)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between discount-row">
                    <span>Discount</span>
                    <span>
                      {"- " + getConvertedCurrencyWithSymbol(isPromoApplied ? oldSubtotal - newSubtotal : 0, baseCurrency, currency)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Shipping</span>
                    <span>Included</span>
                  </li>
                </ul>
              </Container>
              <hr />
              <Container className="px-4">
                <ul>
                  <li className="d-flex justify-content-between">
                    <span>Total</span>
                    <span>{convertedPrice}</span>
                  </li>
                </ul>
              </Container>
              <Container className="px-4 mt-4">
                <Button variant="main-inverse" className="w-100 mb-4" onClick={handleGoToCheckout}>Checkout</Button>
              </Container>
            </Card.Body>

          </Card>
        </Col>
      </Row>
      <Modal show={productsModal} onHide={()=>setProductsModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Checkout Our Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>It seems like your cart is empty. Checkout our products and add them to your cart.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="main-border" onClick={() =>setProductsModal(false)}>Close</Button>
          <Button variant="main-inverse" onClick={() => navigate('/Products')}>Go to Products</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CartPage;
