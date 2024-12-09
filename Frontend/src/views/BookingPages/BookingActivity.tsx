import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import {
  FaWallet,
  FaCreditCard,
} from "react-icons/fa";
import { ActivityService } from "../../services/ActivityService";
import { IActivity } from "../../types/IActivity";
import "./bookingPage.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TouristService } from "../../services/TouristService";
import { setWalletBalance as setWalletBalanceAction } from "../../store/userSlice";
import { useAppContext } from "../../AppContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/paymentForm";
import { FileService } from "../../services/FileService";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const BookingActivity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activityData, setActivityData] = useState<IActivity | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("Wallet");
  const Tourist = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const [walletBalance, setWalletBalanceState] = useState<number>(0);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [oldSubtotal, setOldSubtotal] = useState(walletBalance);
  const [newSubtotal, setNewSubtotal] = useState(walletBalance);
  const [havePromoCode, setHavePromoCode] = useState(false);

  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();
  const [clientSecret, setClientSecret] = useState(''); // Add state for clientSecret
  const stripeFormRef = useRef<any>(null);

  const convertedPrice = (price: number) =>
    getConvertedCurrencyWithSymbol(price, baseCurrency, currency);

  const [promoError, setPromoError] = useState("");

  const handleApplyPromoCode = async () => {
    try {
      let promo = await TouristService.isValidPromoCode(promoCode);

      if (promo.status === 200 && promo.data.valid && activityData?.price !== undefined) {
        let promoData = promo.data;
        promoData = {
          ...promoData,
          discountType: "percentage",
        }

        let discountedSubtotal = activityData.price;

        if (promoData.discountType === "flat") {
          discountedSubtotal -= promoData.discountValue;
        } else if (promoData.discountType === "percentage") {
          const discount = (activityData.price * promoData.discount_percent) / 100;
          discountedSubtotal -= discount;
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

  const getActivityById = async (id: string) => {
    const activity = await ActivityService.getActivityById(id);
    setActivityData(activity.data);
    setOldSubtotal(activity.data.price);
    setNewSubtotal(activity.data.price);
    if (activity.data.image) {
      const image = await FileService.downloadFile(activity.data.image);
      const url = URL.createObjectURL(image);
      setActivityData((prevActivityData) => prevActivityData ? {
        ...prevActivityData,
        image: url,
      } : null);
    }
  };

  useEffect(() => {
    if (id) {
      getActivityById(id);
    }
  }, [id]);

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
  }, [id, Tourist]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (paymentMethod !== "CreditCard") return;
        const response = await TouristService.createPaymentIntent(currency, newSubtotal);
        console.log(response.data);
        setClientSecret(response.data.client_secret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
    fetchClientSecret();
  }, [paymentMethod]);

  const convertedWallet = useMemo(() => {
    return getConvertedCurrencyWithSymbol(walletBalance, baseCurrency, currency);
  }, [walletBalance, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const dispatch = useAppDispatch();

  const handleConfirmPayment = async () => {
    if (paymentMethod === "Wallet") {
      try {
        if (id) {
          await TouristService.bookActivity(Tourist.email, id, paymentMethod);
        }
        const newBalance =
          walletBalance -
          (activityData && activityData.price ? activityData.price : 0);
        setWalletBalanceState(newBalance);
        dispatch(setWalletBalanceAction(newBalance));
        navigate("/tourist/Profile");
      } catch (error) {
        console.error("Error booking activity:", error);
      }
    } else if (paymentMethod === "CreditCard") {
      if (stripeFormRef.current) {
        const { success, error } = await stripeFormRef.current.submit();

        if (success) {
          showToastMessage("Payment was successful!", ToastTypes.SUCCESS);
          try {
            if (id) {
              await TouristService.bookActivity(Tourist.email, id, paymentMethod);
            }
            const newBalance =
              walletBalance -
              (activityData && activityData.price ? activityData.price : 0);
            setWalletBalanceState(newBalance);
            dispatch(setWalletBalanceAction(newBalance));
            navigate("/tourist/Profile");
          } catch (error) {
            console.error("Error booking activity:", error);
          }
          navigate("/MyBookings/upcoming");
        }
      }

    }
  };

  // Manage the state for the rating
  const isBlobUrl = (url: string) => /^blob:/.test(url);

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
                <h4 className="fw-bold">Payment Method</h4>
                <Form.Group className="mt-2">
                  <Form.Check
                    type="radio"
                    label={
                      <span>
                        <FaWallet className="me-2" /> Wallet (Balance: {convertedWallet})
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
        <Col md={4}>
          {activityData ? (
            <>
              <Card className="shadow-sm cart-summary">
                <Card.Header className="bg-white mt-2">
                  <h4 className="fw-bold">Order Summary</h4>
                </Card.Header>
                <Card.Body className="p-0 pt-3">
                  <Container className="px-4">
                    <Row className="mb-3">
                      <Col xs={3}>
                        <img
                          src={typeof activityData.image === 'string' && isBlobUrl(activityData.image) ? activityData.image : "https://via.placeholder.com/150"}
                          alt={activityData.name}
                          className="img-fluid rounded-3"
                        />
                      </Col>
                      <Col xs={9} className="ps-0">
                        <div className="d-flex justify-content-between h-100">
                          <div>
                            <span>{activityData.name}</span>
                            <p className="text-muted">{activityData.category.type}</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <span>{activityData.price !== undefined ? convertedPrice(activityData.price) : "N/A"}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
                <Card.Footer className="p-0 pt-3 bg-transparent">
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
                          {getConvertedCurrencyWithSymbol(oldSubtotal, baseCurrency, currency)}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between discount-row">
                        <span>Discount</span>
                        <span>
                          {"- " + getConvertedCurrencyWithSymbol(isPromoApplied ? oldSubtotal - newSubtotal : 0, baseCurrency, currency)}
                        </span>
                      </li>
                    </ul>
                  </Container>
                  <hr />
                  <Container className="px-4">
                    <ul>
                      <li className="d-flex justify-content-between">
                        <span>Total</span>
                        <span>{convertedPrice(newSubtotal)}</span>
                      </li>
                    </ul>
                  </Container>
                  <Container className="px-4 mt-4">
                    <Button variant="main-inverse" className="w-100 mb-4" onClick={handleConfirmPayment}>Confirm Order</Button>
                  </Container>
                </Card.Footer>

              </Card>
            </>
          ) : (
            <p>Loading activity details...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookingActivity;
