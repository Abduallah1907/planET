import React, { useMemo, useState } from 'react';
import './Cards.css';
import { Card, Row, Col, Button, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import Rating from '../Rating/Rating';

interface HotelCardProps {
    hotelData: any
    onClick?: () => void;
    bookButton?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotelData, onClick, bookButton }) => {
    const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

    const convertedTotalPrice = useMemo(() => {
        return getConvertedCurrencyWithSymbol(hotelData.offers[0].price.total, baseCurrency, currency);
    }, [hotelData, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

    const handleBookingClick = () => {
        onClick && onClick();
    }

    return (
        <Card
            className="shadow-sm d-flex align-items-center hotel-card"
            style={{ borderRadius: "10px", height: "100%" }}
        >
            <Row className="h-100 w-100 d-flex justify-content-between">
                <Col sm={12} md={4} lg={3} className='p-3'>
                    <Image
                        src='https://via.placeholder.com/250x250'
                        rounded
                        alt="Hotel Image"
                        style={{ objectFit: "cover", height: "100%", width: "100%" }}
                    />
                </Col>
                <Col sm={12} md={5} className='p-3'>
                    <Card.Title>{hotelData.hotel.name}</Card.Title>
                    <Row>
                        <Col xs={"auto"}>
                            <span>{((hotelData.hotel.rating.overallRating / 100) * 5).toFixed(2)}</span>
                        </Col>
                        <Col xs={"auto"} className='p-0 align-content-center'>
                            <Rating
                                rating={((hotelData.hotel.rating.overallRating / 100) * 5)}
                                readOnly={true} />
                        </Col>
                        <Col xs={"auto"}>
                            <Card.Text>{hotelData.hotel.rating.numberOfReviews} reviews</Card.Text>
                        </Col>
                    </Row>
                    <Card.Text>{hotelData.offers[0].room.description.text}</Card.Text>
                </Col>
                <Col sm={12} md={3} lg={4} className='p-3 hotel-pricing d-flex align-items-center justify-content-end'>
                    <Row className='text-center w-100'>
                        <>
                            <span className='hotel-total-price'>{convertedTotalPrice}</span><Card.Text>per night</Card.Text>
                            <div>
                                <Button variant="custom" className='w-100 border-0' onClick={handleBookingClick}>Book Now</Button>
                            </div>
                        </>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}
export default HotelCard;