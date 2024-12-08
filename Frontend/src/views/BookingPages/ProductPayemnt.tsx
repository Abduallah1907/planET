import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Table,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaWallet,
  FaCreditCard,
} from "react-icons/fa";
import "./bookingPage.css";
import InputMask from "react-input-mask";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";
import { setWalletBalance as setWalletBalanceAction } from "../../store/userSlice";
import { clearCart } from "../../store/cartSlice";
import { BiChevronDown } from "react-icons/bi";
import AddDeliveryAddress from "../CreatePages/AddDeliveryAddress";
import { useAppContext } from "../../AppContext";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";

interface DeliveryAddress {
  _id: string;
  street_name: string;
  apartment_number: string;
  city: string;
  country: string;
  postal_code: number;
}

interface FormData {
  DeliveryAddress: string;
}

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
  const [discountValue, setDiscountValue] = useState<number>(Cart.discountPercent); // Example: 10% discount
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [formData, setFormData] = useState<FormData>({
    DeliveryAddress: "",
  });

  const [addressModalShow, setAddressModalShow] = useState(false);

  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(walletBalance, baseCurrency, currency);
  }, [walletBalance, baseCurrency, currency, getConvertedCurrencyWithSymbol]);


  const handleOpenAddressModal = async () => {
    setAddressModalShow(true);
  }

  const handleCloseAddressModal = () => {
    setAddressModalShow(false);
  }

  // Calculate discount amount and final total
  const calculateDiscount = (total: number): number => {
    return discountType === "percentage" ? (total * discountValue) / 100 : discountValue;
  };

  const totalBeforeDiscount = Cart.total; // Cart total before applying the discount
  const discountAmount = calculateDiscount(totalBeforeDiscount);
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  const getAddresses = async () => {
    const response = await TouristService.getAddresses(Tourist.email);
    setAddresses(response.data);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, DeliveryAddress: event.target.value });
  };

  useEffect(() => {
    getAddresses();
  }, []);

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

  const cardPatterns = {
    Amex: /^3[47]/,
    Diners: /^3(?:0[0-5]|[68])/,
    Discover: /^6(?:011|5[0-9])/,
    Jcb: /^(?:2131|1800|35\d)/,
    Maestro: /^(5018|5020|5038|6304|6759|6761|6763)/,
    Mastercard: /^5[1-5]/,
    Unionpay: /^62/,
    Visa: /^4/,
  };


  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof typeof cardDetails;
    const newErrors = {
      cardNumber: "Please enter your card number",
      expiryDate: "Please enter your expiration date",
      cvv: "Please enter your CVV",
      firstName: "Please enter your first name",
      lastName: "Please enter your last name",
    };

    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: value ? "" : newErrors[fieldName],
    }));

    if (name === "expiryDate" && value.length === 5) {
      const [month, year] = value.split('/');
      if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          expiryDate: "Invalid month. Use MM/YY.",
        }));
      } else if (parseInt(year, 10) <= new Date().getFullYear() % 100 && parseInt(month, 10) < new Date().getMonth() + 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          expiryDate: "Card has expired.",
        }));
      }
    }

    if (name === "cardNumber") {
      const cardType = Object.keys(cardPatterns).find((card) =>
        cardPatterns[card as keyof typeof cardPatterns].test(value)
      );
      setCardType(cardType ?? null);
    }
  };

  const validateCardDetails = () => {
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
    } else if (paymentMethod === "CreditCard") {
    }
  };


  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={7}>
          <Card>
            <Card.Header className="pt-2 pb-0 bg-transparent">
              <h3 className="fw-bold">Confirm Your Order</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <h4 className="fw-bold">Contact Information</h4>
                <Form.Group>
                  <Form.Control
                    type="email"
                    className="custom-form-control"
                    value={Tourist.email}
                    readOnly
                  />
                </Form.Group>
              </Row>
              <Row className="mt-4">
                <h4 className="fw-bold">Delivery Address</h4>
                <Button
                  variant="main-inverse"
                  className="mb-2 w-50 ms-2"
                  onClick={handleOpenAddressModal}
                >
                  Add New Address
                </Button>
                {addresses.length > 0 && (
                  <div className="custom-select-container">
                    <Form.Control
                      type="text"
                      as="select"
                      className="custom-form-control"
                      value={formData.DeliveryAddress}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Address</option>
                      {addresses.map((address) => (
                        <option key={address._id} value={address._id}>
                          {address.apartment_number}, {address.street_name},{" "}
                          {address.city}, {address.country}
                        </option>
                      ))}
                    </Form.Control>
                    <BiChevronDown className="dropdown-icon me-2" />
                  </div>
                )}
              </Row>
              <Row className="mt-4">
                <h4 className="fw-bold">Payment Method</h4>
                <Form.Group className="mt-2">
                  <Form.Check
                    type="radio"
                    label={
                      <span>
                        <FaWallet className="me-2" /> Wallet (Balance: {convertedPrice})
                      </span>
                    }
                    name="paymentMethod"
                    value="Wallet"
                    checked={paymentMethod === "Wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                </Form.Group>
                <Form.Group>
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
                  />
                </Form.Group>
                {paymentMethod === "CreditCard" && (
                  <div className="bank-card-details">
                    <Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Card Number</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            className="custom-form-control"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            placeholder="Enter card number"
                            required={paymentMethod === "CreditCard"}
                          />
                          {cardType && (
                            <PaymentIcon type={cardType as "Amex" | "Diners" | "Discover" | "Jcb" | "Maestro" | "Mastercard" | "Unionpay" | "Visa"} format="flatRounded" className="ms-2" width={70} />
                          )}
                        </div>
                        {errors.cardNumber && (
                          <div className="text-danger mt-1">{errors.cardNumber}</div>
                        )}
                      </Form.Group>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Expiry Date</Form.Label>
                          <InputMask
                            mask="99/99"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailsChange}
                          >
                            {(inputProps: any) => (
                              <Form.Control
                                {...inputProps}
                                type="text"
                                name="expiryDate"
                                className="custom-form-control"
                                placeholder="MM/YY"
                                required={paymentMethod === "CreditCard"}
                              />
                            )}
                          </InputMask>
                          {errors.expiryDate && (
                            <div className="text-danger mt-1">{errors.expiryDate}</div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">CVV</Form.Label>
                          <Form.Control
                            type="number"
                            name="cvv"
                            min={100}
                            max={999}
                            value={cardDetails.cvv}
                            className="custom-form-control"
                            onChange={handleCardDetailsChange}
                            placeholder="Enter CVV"
                            required={paymentMethod === "CreditCard"}
                          />
                          {errors.cvv && (
                            <div className="text-danger mt-1">{errors.cvv}</div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={cardDetails.firstName}
                            className="custom-form-control"
                            onChange={handleCardDetailsChange}
                            placeholder="Enter first name"
                            required={paymentMethod === "CreditCard"}
                          />
                          {errors.firstName && (
                            <div className="text-danger mt-1">{errors.firstName}</div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={cardDetails.lastName}
                            className="custom-form-control"
                            onChange={handleCardDetailsChange}
                            placeholder="Enter last name"
                            required={paymentMethod === "CreditCard"}
                          />
                          {errors.lastName && (
                            <div className="text-danger mt-1">{errors.lastName}</div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={5} lg={5}>
          <Card className="mb-4 checkout-page">
            <Card.Header className="bg-white mt-2">
              <h4 className="fw-bold">Order Summary</h4>
            </Card.Header>
            <Card.Body className="pb-1">
              {Cart.products.map((product: any) => (
                <div key={product.product.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="position-relative">
                      <Image src={product.product.image} alt={product.product.name} className="border rounded-2" width={75} height={75} />
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="shadow quantity-tooltip">
                            <div className='d-flex flex-column'>
                              <div>Quantity</div>
                            </div>
                          </Tooltip>
                        }
                      >
                        <div className="product-quantity text-white rounded-circle d-flex justify-content-center align-items-center">
                          <span className="m-0">{product.quantity}</span>
                        </div>
                      </OverlayTrigger>
                    </div>
                    <div className="ms-2">
                      <h5 className="mb-0">{product.product.name}</h5>
                      <p className="mb-0">{getConvertedCurrencyWithSymbol(product.product.price, baseCurrency, currency)}</p>
                    </div>
                  </div>
                  <p className="mb-0 fw-bold">{getConvertedCurrencyWithSymbol(product.product.price * product.quantity, baseCurrency, currency)}</p>
                </div>
              ))}
            </Card.Body>
            <Card.Footer className="bg-transparent">
              <Row>
                <Col>
                  <h6 className="fw-bold">Subtotal</h6>
                </Col>
                <Col className="text-end">
                  <h6>{getConvertedCurrencyWithSymbol(totalBeforeDiscount, baseCurrency, currency)}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6 className="fw-bold">Discount</h6>
                </Col>
                <Col className="text-end discount-row">
                  <h6>{"-" + getConvertedCurrencyWithSymbol(discountAmount, baseCurrency, currency)}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6 className="fw-bold">Shipping</h6>
                </Col>
                <Col className="text-end">
                  <h6>Included</h6>
                </Col>
              </Row>
            </Card.Footer>
            <Card.Footer className="bg-transparent">
              <Row>
                <Col>
                  <h5 className="fw-bold">Total</h5>
                </Col>
                <Col className="text-end">
                  <h5>{getConvertedCurrencyWithSymbol(totalAfterDiscount, baseCurrency, currency)}</h5>
                </Col>
              </Row>
              <Row className="mx-1 mt-2">
                <Button variant="main-inverse" className="w-100 mb-2" onClick={handleConfirmPayment}>Confirm Order</Button>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row >
      <AddDeliveryAddress
        show={addressModalShow}
        onHide={handleCloseAddressModal}
        onSubmit={(address: DeliveryAddress) => {
          setAddresses([...addresses, address]);
          setFormData({ ...formData, DeliveryAddress: address._id });
        }}
      />
    </Container >
  );
};

export default ProductPayemnt;
