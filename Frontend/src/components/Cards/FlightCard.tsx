import React, { useMemo } from 'react';
import { PiBagSimpleFill } from 'react-icons/pi';
import './Cards.css';
import { Card, Row, Col, Button } from 'react-bootstrap';
import airlinesData from '../../airlines.json';
import { useAppContext } from '../../AppContext';
import { BsFillSuitcase2Fill } from 'react-icons/bs';
import { FaUtensils } from 'react-icons/fa';

interface FlightCardProps {
    flightData: any
    onClick?: () => void;
    bookButton?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flightData, onClick, bookButton }) => {
    const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();

    const convertedPersonPrice = useMemo(() => {
        return getConvertedCurrencyWithSymbol(Number(flightData.price.total) / Number(flightData.travelerPricings.length), baseCurrency, currency);
    }, [flightData, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

    const convertedTotalPrice = useMemo(() => {
        return getConvertedCurrencyWithSymbol(flightData.price.total, baseCurrency, currency);
    }, [flightData, baseCurrency, currency, getConvertedCurrencyWithSymbol]);

    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return duration;

        const hours = match[1] ? match[1].replace('H', 'h ') : '';
        const minutes = match[2] ? match[2].replace('M', 'm') : '';

        return `${hours}${minutes}`.trim();
    };

    const parseDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return { hours: 0, minutes: 0 };

        const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
        const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;

        return { hours, minutes };
    };

    const addDurations = (durations: string[]) => {
        let totalHours = 0;
        let totalMinutes = 0;

        durations.forEach(duration => {
            const { hours, minutes } = parseDuration(duration);
            totalHours += hours;
            totalMinutes += minutes;
        });

        // Convert total minutes to hours and minutes
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        return `PT${totalHours}H${totalMinutes}M`;
    };

    const handleBookingClick = () => {
        onClick && onClick();
    }

    return (
        <Card
            className="shadow-sm d-flex align-items-center flight-card"
            style={{ borderRadius: "10px", height: "100%" }}
        >
            <Row className="h-100 w-100 d-flex justify-content-between">
                <Col sm={12} md={8} className='p-3'>
                    {flightData.itineraries.map((itinerary: any, index: number) => (
                        <Row className='w-100'>
                            <Col sm={3} md={3} className="d-flex flex-column justify-content-center">
                                {itinerary.segments.map((segment: any, segmentIndex: number) => {
                                    if (segmentIndex === 0) {
                                        const airline = airlinesData.data.find((airline: any) => airline.iata_code === segment.carrierCode) as { logo: string, name: string } | undefined;
                                        return (
                                            <Row key={segmentIndex} className='airline-logo h-100 align-content-center'>
                                                {airline?.logo ? (
                                                    <div>
                                                        <img src={airline.logo} alt={airline.name} />
                                                    </div>
                                                ) : (
                                                    <div>{segment.carrierCode}</div>
                                                )}
                                            </Row>
                                        );
                                    }
                                    return null;
                                })}
                            </Col>
                            <Col sm={9} md={9}>
                                <Row className='h-100 align-content-center'>
                                    <Col xs={4} sm={4} md={4} className='text-end d-flex flex-column justify-content-center'>
                                        <span className='flight-time'>{itinerary.segments[0].departure.at.split("T")[1].substring(0, 5)}</span>
                                        <span className='flight-airline-iataCode'>{itinerary.segments[0].departure.iataCode}</span>
                                    </Col>
                                    <Col xs={5} sm={5} md={5} className='text-center'>
                                        <span className='flight-duration'>{
                                            itinerary.duration ?
                                                formatDuration(itinerary.duration) :
                                                formatDuration(addDurations(itinerary.segments.map((segment: any) => segment.duration)))
                                        }</span>
                                        <div className='flight-path'>
                                            {itinerary.segments.map((segment: any, segmentIndex: number) => {
                                                if (segmentIndex !== 0) {
                                                    return (
                                                        <span key={segmentIndex} className='flight-transit-stop'></span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <div className='p-0'>
                                            {itinerary.segments.length > 1 ? (
                                                <>
                                                    <span className='flight-stop'>{itinerary.segments.length - 1} stop </span>
                                                    <span>{itinerary.segments.map((segment: any, segmentIndex: number) => {
                                                        if (index !== 0) {
                                                            return (
                                                                <span key={index} className='flight-duration'>{segment.departure.iataCode}</span>
                                                            );
                                                        }
                                                        return null;
                                                    })}</span>
                                                </>
                                            ) : (
                                                <span className='flight-direct'>Direct</span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col xs={3} sm={3} md={3} className='text-start d-flex flex-column justify-content-center'>
                                        <span className='flight-time'>{itinerary.segments[itinerary.segments.length - 1].arrival.at.split("T")[1].substring(0, 5)}</span>
                                        <span className='flight-airline-iataCode'>{itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </Col>
                <Col sm={12} md={4} className='p-3 flight-pricing d-flex align-items-center justify-content-end'>
                    <Row className='text-center w-100'>
                        {bookButton ? (
                            <>
                                <span className='flight-base-price'>{convertedPersonPrice}</span>
                                <span className='flight-total-price'>{convertedTotalPrice} total</span>
                                <div>
                                    <Button variant="custom" className='w-100 border-0' onClick={handleBookingClick}>Book Now</Button>
                                </div>
                            </>
                        ) :
                            (
                                <Col sm={12} className='baggage-info'>
                                    <Row>
                                        <Col xs={"auto"} className='p-0'>
                                            <div className='bag-icon'>
                                                <PiBagSimpleFill />
                                                <span>1</span>
                                            </div>
                                        </Col>
                                        <Col xs={"auto"} className='p-0'>
                                            <div className='bag-icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 22 22" className="text-white"><path d="M9.629 3.94h2.726v2.096H9.63zm4.543 2.096h-.909V3.94a.46.46 0 0 0 .455-.463.46.46 0 0 0-.455-.463H8.721a.46.46 0 0 0-.454.463c0 .255.203.463.454.463v2.096h-.908c-1.002 0-1.817.83-1.817 1.852v8.336c0 1.021.815 1.852 1.817 1.852h.227v.463c0 .256.203.463.454.463s.454-.207.454-.463v-.463h4.088v.463a.46.46 0 0 0 .455.463c.25 0 .454-.207.454-.463v-.463h.227c1.002 0 1.817-.831 1.817-1.852V7.888c0-1.021-.815-1.852-1.817-1.852"></path></svg>
                                                <span>1</span>
                                            </div>
                                        </Col>
                                        <Col className='align-items-center d-flex text-start'>
                                            <span>Baggage Info</span>
                                        </Col>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Col xs={"auto"} className='p-0'>
                                            <div className='amenity-icon'>
                                                <FaUtensils />
                                            </div>
                                        </Col>
                                        <Col className='align-items-center d-flex text-start'>
                                            <span>Meal</span>
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        }
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default FlightCard;