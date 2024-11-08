import React, { useEffect, useMemo, useState } from 'react';
import FlightCard from '../../components/Cards/FlightCard'; // Assuming you have a FlightCard component
// import PassengerDetails from '../components/PassengerDetails'; // Assuming you have a PassengerDetails component
import { useAppSelector } from '../../store/hooks';
import AmadeusService from '../../services/AmadeusService';
import { Button, Card, Col, Collapse, Container, Row } from 'react-bootstrap';
import './flightBooking.css';
import { BiChevronUp } from 'react-icons/bi';
import { useAppContext } from '../../AppContext';
import { TextField } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { MuiPhone } from '../../components/MuiPhone';

interface TravelerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    emailAddress: string;
    phoneNumber?: string;
    countryCallingCode?: string;
}

const FlightBooking: React.FC = () => {
    const flight = useAppSelector((state) => state.flight);
    const navigate = useNavigate();
    const [flightPrice, setFlightPrice] = useState<any | null>(null);
    const [collapseStates, setCollapseStates] = useState<boolean[]>([]);
    const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();
    const [travelerData, setTravelerData] = useState<TravelerData[]>([]);

    const handleToggleCollapse = (index: number) => {
        setCollapseStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    const convertedTravelerPricings = useMemo(() => {
        return flightPrice ? flightPrice.travelerPricings.map((traveler: any) => {
            const convertedTotal = getConvertedCurrencyWithSymbol(traveler.price.total, baseCurrency, currency);
            const convertedBase = getConvertedCurrencyWithSymbol(traveler.price.base, baseCurrency, currency);
            const convertedTaxes = getConvertedCurrencyWithSymbol(traveler.price.total - traveler.price.base, baseCurrency, currency);
            return {
                ...traveler,
                price: {
                    ...traveler.price,
                    convertedTotal,
                    convertedBase,
                    convertedTaxes,
                },
            };
        }) : [];
    }, [flightPrice, currency, baseCurrency, getConvertedCurrencyWithSymbol]);

    useEffect(() => {
        try {
            if (flight.selectedFlightOffer === undefined) {
                navigate('/flights');
                return;
            }
            const fetchFlightPrice = async () => {
                const response = await AmadeusService.getFlightPrice({
                    data: {
                        type: 'flight-offers-pricing',
                        flightOffers: [
                            flight.selectedFlightOffer
                        ],
                    }
                });
                setFlightPrice(response.data.flightOffers[0]);
                setCollapseStates(new Array(response.data.flightOffers[0].travelerPricings.length).fill(true));
                setTravelerData(new Array(response.data.flightOffers[0].travelerPricings.length).fill({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: '',
                    emailAddress: '',
                    phoneNumber: '',
                    countryCallingCode: '',
                }));
            };
            fetchFlightPrice();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, key: keyof TravelerData) => {
        setTravelerData(prevData => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [key]: e.target.value,
            };
            return newData;
        });
    }

    return (
        <div className='m-3 flight-booking-container'>
            <Row>
                {flightPrice !== null ? (
                    <>
                        <Col sm={12} md={8}>
                            <section>
                                <FlightCard flightData={flightPrice} bookButton={false} />
                                <Card className='rounded-1 mt-3 shadow passenger-details'>
                                    <Card.Header>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                Passenger Details
                                            </div>
                                            <div className='num-tickets'>
                                                {flightPrice.travelerPricings.length} {flightPrice.travelerPricings.length > 1 ? 'tickets' : 'ticket'}
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* Display passenger details form here */}
                                        <div className='booking-info'>
                                            Please enter each passenger's information exactly as it appears on the passport or government-issued photo ID that the passenger presents at the airport. Name changes are not permitted after booking.
                                        </div>
                                        {/* <PassengerDetails /> */}
                                        {flightPrice.travelerPricings.map((traveler: any, index: number) => (
                                            <div key={index} className='traveler-details mt-2'>
                                                <div className='d-flex justify-content-between passenger-info-header'>
                                                    <span>Passenger {index + 1}</span>
                                                    <span className='text-capitalize'>{traveler.travelerType.replace('_', ' ').toLowerCase()} {index == 0 && ', primary contact'}</span>
                                                </div>
                                                <div>
                                                    <Row>
                                                        <Col sm={12} md={6}>
                                                            <TextField
                                                                label='First Name'
                                                                margin='dense'
                                                                value={travelerData[index].firstName}
                                                                onChange={(e) => handleChange(e, index, 'firstName')}
                                                                size='small'
                                                                fullWidth />
                                                            <TextField
                                                                label='Last name'
                                                                margin='dense'
                                                                value={travelerData[index].lastName}
                                                                onChange={(e) => handleChange(e, index, 'lastName')}
                                                                size='small'
                                                                fullWidth />
                                                        </Col>
                                                        <Col sm={12} md={6}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DateField
                                                                    label='Date Of Birth'
                                                                    value={travelerData[index].dateOfBirth !== '' ? dayjs(travelerData[index].dateOfBirth) : undefined}
                                                                    onChange={(date) => date && handleChange({ target: { value: date.format('YYYY-MM-DD') } } as any, index, 'dateOfBirth')}
                                                                    format="YYYY-MM-DD"
                                                                    margin='dense'
                                                                    size='small'
                                                                    fullWidth />
                                                            </LocalizationProvider>
                                                            <div className='d-flex flex-row gender-selector'>
                                                                <Button
                                                                    className={`w-50 ${travelerData[index].gender === "MALE" && "active"}`}
                                                                    onClick={() => handleChange({ target: { value: "MALE" } } as any, index, 'gender')}>Male</Button>
                                                                <Button
                                                                    className={`w-50 ${travelerData[index].gender === "FEMALE" && "active"}`}
                                                                    onClick={() => handleChange({ target: { value: "FEMALE" } } as any, index, 'gender')}>Female</Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} md={6}>
                                                            <TextField
                                                                label='Email Address'
                                                                type='email'
                                                                margin='dense'
                                                                value={travelerData[index].emailAddress}
                                                                onChange={(e) => handleChange(e, index, 'emailAddress')}
                                                                size='small'
                                                                fullWidth />
                                                        </Col>
                                                        <Col sm={12} md={6}>
                                                            <MuiPhone
                                                                margin='dense'
                                                                size='small'
                                                                fullWidth
                                                                value={travelerData[index].phoneNumber || ''}
                                                                onChange={function (phone: string, country: string): void {
                                                                    handleChange({ target: { value: phone } } as any, index, 'phoneNumber');
                                                                    handleChange({ target: { value: country } } as any, index, 'countryCallingCode');
                                                                }} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ))}
                                    </Card.Body>

                                </Card>
                            </section>
                            {/* <PassengerDetails /> */}
                        </Col>
                        <Col sm={12} md={4}>
                            <aside style={{ position: 'sticky', top: '0' }}>
                                <Card className='rounded-1 price-summary shadow '>
                                    <Card.Header>Price Summary</Card.Header>
                                    <Card.Body className='px-4 py-0'>
                                        {/* Display flight price details here */}
                                        {convertedTravelerPricings.map((traveler: any, index: number) => (
                                            <div key={index} className='travel-price'>
                                                <Button
                                                    variant='pricing'
                                                    className='w-100 border-0'
                                                    onClick={() => handleToggleCollapse(index)}
                                                    aria-controls={`collapse-${index}`}
                                                    aria-expanded={collapseStates[index]}
                                                >
                                                    <Row>
                                                        <Col xs={'auto'} className='text-start'>
                                                            <span>Passenger {index + 1}: {traveler.travelerType.replace('_', ' ').toLowerCase()}</span>
                                                        </Col>
                                                        <Col xs={'auto'}>
                                                            <div className={`arrow-icon ${!collapseStates[index] ? 'flip' : ''}`}>
                                                                <span><BiChevronUp /></span>
                                                            </div>
                                                        </Col>
                                                        <Col className='text-end'>
                                                            <span>{traveler.price.convertedTotal}</span>
                                                        </Col>
                                                    </Row>
                                                </Button>
                                                <Collapse in={collapseStates[index]} className='mt-2 pricing-data'>
                                                    <div id={`collapse-${index}`}>
                                                        <div className='d-flex justify-content-between'>
                                                            <div>
                                                                Base fare
                                                            </div>
                                                            <div className='price'>
                                                                {traveler.price.convertedBase}
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between'>
                                                            <div>
                                                                Taxes, fees, and charges
                                                            </div>
                                                            <div className='price'>
                                                                {traveler.price.convertedTaxes}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            </div>
                                        ))}
                                        <div className='total-price pb-2'>
                                            <Row className='py-4'>
                                                <Col className='text-start '>
                                                    <span>Total inc. taxes and fees:</span>
                                                </Col>
                                                <Col className='text-end'>
                                                    <span>{getConvertedCurrencyWithSymbol(flightPrice.price.grandTotal, baseCurrency, currency)}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card.Body>

                                    {/* Add your payment form or details here */}
                                </Card>
                            </aside>
                        </Col>
                    </>
                ) : (
                    <p>Loading flight details...</p>
                )}
            </Row>
        </div>
    );
};

export default FlightBooking;