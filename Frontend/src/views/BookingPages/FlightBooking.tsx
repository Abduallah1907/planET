import React, { useEffect, useMemo, useState } from 'react';
import FlightCard from '../../components/Cards/FlightCard'; // Assuming you have a FlightCard component
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AmadeusService from '../../services/AmadeusService';
import { Button, Card, Col, Collapse, Container, Form, Row } from 'react-bootstrap';
import './flightBooking.css';
import { BiChevronUp } from 'react-icons/bi';
import { useAppContext } from '../../AppContext';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { MuiPhone } from '../../components/MuiPhone';
import countryOptions from '../../utils/countryOptions.json';
import { format } from 'date-fns';
import { selectFlightPrice } from '../../store/flightSlice';
import showToastMessage from '../../utils/showToastMessage';
import { ToastTypes } from '../../utils/toastTypes';

interface TravelerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    emailAddress: string;
    phoneNumber?: string;
    countryCallingCode?: string;
    passportNumber: string;
    passportExpirationDate: string;
    passportIssuingCountry: string;
    nationality: string;
}

const FlightBooking: React.FC = () => {
    const flight = useAppSelector((state) => state.flight);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [flightPrice, setFlightPrice] = useState<any | null>(null);
    const [collapseStates, setCollapseStates] = useState<boolean[]>([]);
    const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();
    const [travelerData, setTravelerData] = useState<TravelerData[]>([]);
    const [errors, setErrors] = useState<Map<number, Map<string, string>>>(new Map()); // Add errors state

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
                dispatch(selectFlightPrice(response.data.flightOffers[0]));
                setCollapseStates(new Array(response.data.flightOffers[0].travelerPricings.length).fill(true));
                setTravelerData(new Array(response.data.flightOffers[0].travelerPricings.length).fill({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: '',
                    emailAddress: '',
                    phoneNumber: '',
                    countryCallingCode: '',
                    passportNumber: '',
                    passportExpirationDate: '',
                    passportIssuingCountry: '',
                    nationality: ''
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

    const validateGender = () => {
        let valid = true;
        const newErrors: Map<number, Map<string, string>> = new Map(errors);
        travelerData.forEach((traveler, index) => {
            if (traveler.gender === '') {
                valid = false;
                if (!newErrors.has(index)) {
                    newErrors.set(index, new Map());
                }
                newErrors.get(index)?.set('gender', 'Gender is required.');
            } else {
                newErrors.get(index)?.delete('gender');
            }
        });
        setErrors(newErrors);
        return valid;
    };

    const validateExpirationDate = () => {
        let valid = true;
        const newErrors: Map<number, Map<string, string>> = new Map(errors);
        travelerData.forEach((traveler, index) => {
            const expirationDate = dayjs(traveler.passportExpirationDate);
            const arrival = dayjs(flight.searchQuery?.returnDate || flight.searchQuery?.departureDate);
            const sixMonthsAfterArrival = arrival.add(6, 'month');

            if (traveler.passportExpirationDate !== '' && expirationDate.isBefore(sixMonthsAfterArrival)) {
                valid = false;
                if (!newErrors.has(index)) {
                    newErrors.set(index, new Map());
                }
                newErrors.get(index)?.set('passportExpirationDate', 'Passport expiration date must be at least 6 months after the arrival date.');
            } else {
                if (newErrors.has(index)) {
                    newErrors.get(index)?.delete('passportExpirationDate');
                }
            }
        });
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isGenderValid = validateGender();
        const isExpirationDateValid = validateExpirationDate();
        if (!isGenderValid || !isExpirationDateValid) {
            return;
        }
        const travelers = travelerData.map((traveler: any, index: number) => {
            return {
                id: index + 1,
                dateOfBirth: traveler.dateOfBirth,
                name: {
                    firstName: traveler.firstName,
                    lastName: traveler.lastName,
                },
                gender: traveler.gender,
                contact: {
                    emailAddress: traveler.emailAddress,
                    phones: [
                        {
                            deviceType: 'MOBILE',
                            number: traveler.phoneNumber.replace('+'+traveler.countryCallingCode,''),
                            countryCallingCode: traveler.countryCallingCode,
                        }
                    ]
                },
                documents: [
                    {
                        documentType: 'PASSPORT',
                        number: traveler.passportNumber,
                        expiryDate: traveler.passportExpirationDate,
                        issuanceCountry: traveler.passportIssuingCountry,
                        validityCountry: traveler.passportIssuingCountry,
                        nationality: traveler.nationality,
                        holder: true
                    }
                ]
            }
        });
        const data = {
            data: {
                type: 'flight-order',
                flightOffers: [
                    flightPrice
                ],
                travelers,
                ticketingAgreement: {
                    option: "DELAY_TO_CANCEL",
                    delay: "6D"
                }
            }
        }
        try {
            const response = await AmadeusService.bookFlight(data);
            if (response.status === 200) {
                showToastMessage('Flight booked successfully', ToastTypes.SUCCESS);
            }
            console.log(response);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div className='m-3 flight-booking-container'>
            <Row>
                {flightPrice !== null ? (
                    <>
                        <Col sm={12} md={12} lg={8}>
                            <section>
                                <div className='d-flex flex-column mb-3'>
                                    <span className='trip-destination'>Your trip to {flight.searchQuery?.toSelectedOption}</span>
                                    <span className='trip-duration'>{flight.searchQuery?.departureDate ? format(new Date(flight.searchQuery.departureDate), "dd MMM") : ''}
                                        {flight.searchQuery?.returnDate ? ` - ${format(new Date(flight.searchQuery.returnDate), "dd MMM")}` : ''}
                                    </span>
                                </div>
                                <FlightCard flightData={flightPrice} bookButton={false} />
                                <Form onSubmit={handleSubmit}>
                                    {/* <PassengerDetails /> */}
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
                                                                    required
                                                                    fullWidth />
                                                                <TextField
                                                                    label='Last name'
                                                                    margin='dense'
                                                                    value={travelerData[index].lastName}
                                                                    onChange={(e) => handleChange(e, index, 'lastName')}
                                                                    size='small'
                                                                    required
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
                                                                        required
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
                                                                {errors.get(index)?.has('gender') && <div style={{ color: 'red' }}>{errors.get(index)?.get('gender')}</div>}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm={12} md={6}>
                                                                <TextField
                                                                    label='Email Address'
                                                                    type='email'
                                                                    margin='dense'
                                                                    required
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
                                                                    required
                                                                    value={travelerData[index].phoneNumber || ''}
                                                                    onChange={function (phone: string, country: string): void {
                                                                        handleChange({ target: { value: phone } } as any, index, 'phoneNumber');
                                                                        handleChange({ target: { value: country } } as any, index, 'countryCallingCode');
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm={12} md={6}>
                                                                <TextField
                                                                    label='Passport Number'
                                                                    margin='dense'
                                                                    value={travelerData[index].passportNumber}
                                                                    onChange={(e) => handleChange(e, index, 'passportNumber')}
                                                                    inputProps={{pattern: '^(?!^0+$)[a-zA-Z0-9]{3,20}$'}}
                                                                    size='small'
                                                                    required
                                                                    fullWidth />
                                                                <FormControl fullWidth margin='dense'>
                                                                    <InputLabel size='small'>Passport Issuing Country</InputLabel>
                                                                    <Select
                                                                        label='Passport Issuing Country'
                                                                        value={travelerData[index].passportIssuingCountry}
                                                                        onChange={(e) => handleChange({ target: { value: e.target.value } } as any, index, 'passportIssuingCountry')}
                                                                        size='small'
                                                                        required
                                                                        fullWidth>
                                                                        {countryOptions.map((country, index) => (
                                                                            <MenuItem key={index} value={country.value}>{country.label}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Col>
                                                            <Col sm={12} md={6}>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DateField
                                                                        label='Passport Expiration Date'
                                                                        value={travelerData[index].passportExpirationDate !== '' ? dayjs(travelerData[index].passportExpirationDate) : undefined}
                                                                        onChange={(date) => date && handleChange({ target: { value: date.format('YYYY-MM-DD') } } as any, index, 'passportExpirationDate')}
                                                                        format="YYYY-MM-DD"
                                                                        margin='dense'
                                                                        size='small'
                                                                        helperText=""
                                                                        required
                                                                        fullWidth />
                                                                </LocalizationProvider>
                                                                {errors.get(index)?.get('passportExpirationDate') && <div style={{ color: 'red' }}>{errors.get(index)?.get('passportExpirationDate')}</div>}
                                                                <FormControl fullWidth margin='dense'>
                                                                    <InputLabel size='small'>Nationality</InputLabel>
                                                                    <Select
                                                                        label='Nationality'
                                                                        value={travelerData[index].nationality}
                                                                        onChange={(e) => handleChange({ target: { value: e.target.value } } as any, index, 'nationality')}
                                                                        size='small'
                                                                        required
                                                                        fullWidth>
                                                                        {countryOptions.map((country, index) => (
                                                                            <MenuItem key={index} value={country.value}>{country.label}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                    <Card className='rounded-1 price-summary shadow mt-3 md:hidden'>
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
                                    <div className='d-flex justify-content-end mt-4'>
                                        <Button variant='main-inverse' type='submit'>Book</Button>
                                    </div>
                                </Form>
                            </section>
                        </Col>
                        <Col sm={12} md={4} className='d-none md:block'>
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