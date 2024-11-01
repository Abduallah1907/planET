import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FaWallet, FaCreditCard } from 'react-icons/fa';
import { ActivityService } from '../services/ActivityService';
import { IActivity } from '../types/IActivity';
import './bookingPage.css';
import { useAppSelector } from '../store/hooks';
import { TouristService } from '../services/TouristService';

interface BookingPageProps {
    email: string;
    }

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    profession: string;
    password: string;
    retypePassword: string;
    username: string;
    nationality: string;
    dob: string;
  }
const BookingPage: React.FC<BookingPageProps>= ({email}) => {
  const { id } = useParams<{ id: string }>();
  const [activityData, setActivityData] = useState<IActivity | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  const Tourist = useAppSelector((state) => state.user);

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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const getActivityById = async (id: string) => {
    // Fetch activity data by id
    const activity = await ActivityService.getActivityById(id);
    setActivityData(activity.data);
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
            setWalletBalance(Tourist.stakeholder_id.wallet);
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
    setCardDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: value ? '' : `Please enter your ${name}`,
    }));
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

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'bankCard' && !validateCardDetails()) {
     if(!validateCardDetails()){
        return;
     }
    }
    if (paymentMethod === 'wallet') {
        if(walletBalance < (activityData?.price ?? 0)){
            alert("Insufficient funds in wallet, please top up your wallet to proceed with payment!");
            navigate('/TouristEdit');
            return;
        }
        try {
            if (activityData && activityData.price !== undefined) {
              const newBalance = walletBalance - activityData.price;
              
              
    }


    navigate('/activity'); // Navigate to a confirmation page or another route
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col sm={12} md={8} lg={6}>
          {activityData ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="text-center">{activityData.name}</Card.Title>
                  <Card.Text>Price: ${activityData.price}</Card.Text>
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
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        placeholder="Enter card number"
                      />
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
            <p>Loading activity details...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;