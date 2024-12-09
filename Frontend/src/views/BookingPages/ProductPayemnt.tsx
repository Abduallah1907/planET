import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/paymentForm";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";

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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const ProductPayemnt: React.FC = () => {
  const Cart = useAppSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState<string>("Wallet");
  const Tourist = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const [walletBalance, setWalletBalanceState] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("percentage"); // or "flat"
  const [discountValue, setDiscountValue] = useState<number>(Cart.discountPercent); // Example: 10% discount
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [formData, setFormData] = useState<FormData>({
    DeliveryAddress: "",
  });
  const [clientSecret, setClientSecret] = useState(''); // Add state for clientSecret
  const stripeFormRef = useRef<any>(null);

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

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (paymentMethod !== "CreditCard") return;
        const response = await TouristService.createPaymentIntent(currency, totalAfterDiscount);
        console.log(response.data);
        setClientSecret(response.data.client_secret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
    fetchClientSecret();
  }, [paymentMethod]);

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
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
      // Call the Stripe form's submit method
      const result = await stripeFormRef.current?.submit();

      if (result?.success) {
        showToastMessage("Payment was successful!",ToastTypes.SUCCESS);
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
          dispatch(clearCart());
          navigate("/tourist/Profile");
        } catch (error) {
          console.error("Error booking activity:", error);
        }
        navigate("/Orders/Active");
      }

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
                    {clientSecret && (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm ref={stripeFormRef} />
                      </Elements>
                    )}
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
