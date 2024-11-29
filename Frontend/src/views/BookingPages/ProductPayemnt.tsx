import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Table,
} from "react-bootstrap";
import {
  FaWallet,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";
import "./bookingPage.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";
import { setWalletBalance as setWalletBalanceAction } from "../../store/userSlice";
import { clearCart } from "../../store/cartSlice";

const ProductPayemnt: React.FC = () => {
  const Cart = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState<string>("Wallet");
  const [cardType, setCardType] = useState<string | null>(null);
  const Tourist = useAppSelector((state) => state.user);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const [walletBalance, setWalletBalanceState] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("percentage"); // or "flat"
const [discountValue, setDiscountValue] = useState<number>(10); // Example: 10% discount

// Calculate discount amount and final total
const calculateDiscount = (total: number): number => {
  return discountType === "percentage" ? (total * discountValue) / 100 : discountValue;
};

const totalBeforeDiscount = Cart.total; // Cart total before applying the discount
const discountAmount = calculateDiscount(totalBeforeDiscount);
const totalAfterDiscount = totalBeforeDiscount - discountAmount;


  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        if (Tourist) {
          setWalletBalanceState(Tourist.stakeholder_id.wallet);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, [Tourist]);

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `Please enter your ${name}`,
    }));

    if (name === "cardNumber") {
      // Determine card type
      if (value.startsWith("4")) {
        setCardType("Visa");
      } else if (
        /^5[1-5]/.test(value) ||
        /^2(2[2-9]|[3-6]|7[0-1]|720)/.test(value)
      ) {
        setCardType("MasterCard");
      } else {
        setCardType(null); // Reset if card type is not recognized
      }
    }
  };

  const validateCardDetails = () => {
    const newErrors = {
      cardNumber: cardDetails.cardNumber ? "" : "Please enter your card number",
      expiryDate: cardDetails.expiryDate
        ? ""
        : "Please enter your expiration date",
      cvv: cardDetails.cvv ? "" : "Please enter your CVV",
      firstName: cardDetails.firstName ? "" : "Please enter your first name",
      lastName: cardDetails.lastName ? "" : "Please enter your last name",
    };
    setErrors(newErrors);
    return !newErrors.cardNumber && !newErrors.expiryDate && !newErrors.cvv;
  };

  const dispatch = useAppDispatch();

  const handleConfirmPayment = async () => {
    const finalCost = totalAfterDiscount;
  
    if (paymentMethod === "Wallet") {
      try {
        const orderData = {
          tourist_id: Tourist.stakeholder_id._id,
          cart: {
            items: Cart.products.map((item: any) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
            cost: totalBeforeDiscount, // Save original total for reference
          },
          cost: finalCost, // Use discounted cost for the payment
          payment_type: paymentMethod,
        };
        await TouristService.createOrder(orderData);
        const newBalance = walletBalance - finalCost; // Deduct discounted cost
        setWalletBalanceState(newBalance);
        dispatch(setWalletBalanceAction(newBalance));
        dispatch(clearCart());
        navigate("/tourist/Profile");
      } catch (error) {
        console.error("Error booking activity:", error);
      }
    }
  };
  

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col sm={12} md={8} lg={6}>
          <Card className="mb-4">
          <Card.Body>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {Cart.products.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.product.name}</td>
          <td>{item.quantity}</td>
          <td>${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      ))}
      <tr>
        <td colSpan={3} className="text-end fw-bold">
          Total (Before Discount)
        </td>
        <td>${totalBeforeDiscount.toFixed(2)}</td>
      </tr>
      <tr>
        <td colSpan={3} className="text-end fw-bold">
          Discount
        </td>
        <td>
          {discountType === "percentage"
            ? `-${discountValue}% (-$${discountAmount.toFixed(2)})`
            : `-$${discountAmount.toFixed(2)}`}
        </td>
      </tr>
      <tr>
        <td colSpan={3} className="text-end fw-bold">
          Total (After Discount)
        </td>
        <td>${totalAfterDiscount.toFixed(2)}</td>
      </tr>
    </tbody>
  </Table>
</Card.Body>

          </Card>
          <h3 className="text-center mb-4">Choose Payment Method</h3>
          <Form>
            <Form.Check
              type="radio"
              label={
                <span>
                  <FaWallet className="me-2" /> Wallet (Balance: $
                  {walletBalance})
                </span>
              }
              name="paymentMethod"
              value="Wallet"
              checked={paymentMethod === "Wallet"}
              onChange={handlePaymentMethodChange}
              className="mb-3"
            />
            <Form.Check
              type="radio"
              label={
                <span>
                  <FaCreditCard className="me-2" /> Bank Card
                </span>
              }
              name="paymentMethod"
              value="CreditCard"
              checked={paymentMethod === "CreditCard"}
              onChange={handlePaymentMethodChange}
              className="mb-3"
            />
            {paymentMethod === "CreditCard" && (
              <div className="bank-card-details">
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      placeholder="Enter card number"
                    />
                    {/* Display icon based on card type */}
                    {cardType === "Visa" && (
                      <FaCcVisa className="ms-2 text-primary" />
                    )}
                    {cardType === "MasterCard" && (
                      <FaCcMastercard className="ms-2 text-danger" />
                    )}
                  </div>
                  {errors.cardNumber && (
                    <div className="text-danger">{errors.cardNumber}</div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && (
                    <div className="text-danger">{errors.expiryDate}</div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="Enter CVV"
                  />
                  {errors.cvv && (
                    <div className="text-danger">{errors.cvv}</div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={cardDetails.firstName}
                    onChange={handleCardDetailsChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <div className="text-danger">{errors.firstName}</div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={cardDetails.lastName}
                    onChange={handleCardDetailsChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <div className="text-danger">{errors.lastName}</div>
                  )}
                </Form.Group>
              </div>
            )}
            <Button
              variant="main-inverse"
              className="Confirm-button w-100"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPayemnt;
