import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FaWallet, FaCreditCard } from 'react-icons/fa';
import { IItinerary } from '../types/IItinerary';
import './bookingPage.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { TouristService } from '../services/TouristService';
import { setWalletBalance as setWalletBalanceAction } from '../store/userSlice';
import { ItineraryService } from '../services/ItineraryService';
// Import Visa and MasterCard icons
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import showToast from '../utils/showToast';
import { ToastTypes } from '../utils/toastTypes';


const BookingItinerary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const time_to_attend = searchParams.get("time_to_attend");
  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  const [cardType, setCardType] = useState<string | null>(null);
  const Tourist = useAppSelector((state) => state.user);
  const email = Tourist.email;

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    firstName: '',
    lastName: '',
  });
  const navigate = useNavigate();
  const [walletBalance, setWalletBalanceState] = useState<number>(0);

  const getItineraryById = async (id: string) => {
    const itinerary = await ItineraryService.getItineraryById(id);
    setItineraryData(itinerary.data);
  };

  useEffect(() => {
    if (id) {
      getItineraryById(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        if (Tourist) {
          setWalletBalanceState(Tourist.stakeholder_id.wallet);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
    fetchWalletBalance();
  }, [id, email]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      [name]: value ? '' : `Please enter your ${name}`,
    }));

    if (name === 'cardNumber') {
      // Determine card type
      if (value.startsWith('4')) {
        setCardType('Visa');
      } else if (/^5[1-5]/.test(value) || /^2(2[2-9]|[3-6]|7[0-1]|720)/.test(value)) {
        setCardType('MasterCard');
      } else {
        setCardType(null); // Reset if card type is not recognized
      }
    }
  };

  const validateCardDetails = () => {
    const newErrors = {
      cardNumber: cardDetails.cardNumber ? '' : 'Please enter your card number',
      expiryDate: cardDetails.expiryDate ? '' : 'Please enter your expiration date',
      cvv: cardDetails.cvv ? '' : 'Please enter your CVV',
      firstName: cardDetails.firstName ? '' : 'Please enter your first name',
      lastName: cardDetails.lastName ? '' : 'Please enter your last name',
    };
    setErrors(newErrors);
    return !newErrors.cardNumber && !newErrors.expiryDate && !newErrors.cvv;
  };

  const dispatch = useAppDispatch();

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'wallet') {
      if (itineraryData && itineraryData.price !== undefined && walletBalance < itineraryData.price) {
        showToast('Insufficient balance in wallet', ToastTypes.ERROR);
        return;
      }
      try {
        if (id && time_to_attend) {
          await TouristService.bookItinerary(email, id, time_to_attend);
        } else {
          console.error('Itinerary ID is undefined');
          showToast('Itinerary ID is undefined', ToastTypes.ERROR);
        }
        const newBalance = walletBalance - (itineraryData && itineraryData.price ? itineraryData.price : 0);
        setWalletBalanceState(newBalance);
        dispatch(setWalletBalanceAction(newBalance));
        showToast('Itinerary booked successfully', ToastTypes.SUCCESS);
        console.log(Tourist._id);
        navigate('/tourist/Profile');
      } catch (error) {
        console.error('Error booking itinerary:', error);
        showToast('Error booking itinerary', ToastTypes.ERROR);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col sm={12} md={8} lg={6}>
          {itineraryData ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="text-center">{itineraryData.name}</Card.Title>
                  <Card.Text>Price: ${itineraryData.price}</Card.Text>
                </Card.Body>
              </Card>
              <h3 className="text-center mb-4">Choose Payment Method</h3>
              <Form>
                <Form.Check
                  type="radio"
                  label={
                    <span>
                      <FaWallet className="me-2" /> Wallet (Balance: ${walletBalance})
                    </span>
                  }
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
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
                  value="bankCard"
                  checked={paymentMethod === 'bankCard'}
                  onChange={handlePaymentMethodChange}
                  className="mb-3"
                />
                {paymentMethod === 'bankCard' && (
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
                        {cardType === 'Visa' && <FaCcVisa className="ms-2 text-primary" />}
                        {cardType === 'MasterCard' && <FaCcMastercard className="ms-2 text-danger" />}
                      </div>
                      {errors.cardNumber && <div className="text-danger">{errors.cardNumber}</div>}
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
                      {errors.expiryDate && <div className="text-danger">{errors.expiryDate}</div>}
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
                      {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
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
                      {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
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
                      {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                    </Form.Group>
                  </div>
                )}
                <Button className="Confirm-button w-100" onClick={handleConfirmPayment}>
                  Confirm Payment
                </Button>
              </Form>
            </>
          ) : (
            <p>Loading Itinerary details...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookingItinerary;
