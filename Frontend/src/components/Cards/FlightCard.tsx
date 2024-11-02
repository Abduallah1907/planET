import React from 'react';
import './Cards.css';
import { Card, Row, Col } from 'react-bootstrap';
import airlinesData from '../../airlines.json';

interface FlightCardProps {
    flightData: FlightData
}

interface FlightData {
    oneWay: boolean,
    lastTicketingDate: string,
    lastTicketingTime: string,
    numberOfBookableSeats: number,
    itineraries: Array<Itinerary>,
    price: {
        currency: string,
        total: string,
        base: string,
    },
    pricingOptions: Object,
    travelerPricings: Array<TravelerPricing>;
}

interface Itinerary {
    duration: string,
    segments: Array<Segment>
}

interface TravelerPricing {
    travelerId: string,
    fareOption: string,
    travelerType: string,
    price: {
        currency: string,
        total: string,
        base: string,
    },
    fareDetailsBySegment: Array<Object>,
}

interface Segment {
    departure: { iataCode: string, at: string },
    arrival: { iataCode: string, at: string },
    carrierCode: string,
    number: string,
    aircraft: Object,
    operating: Object,
    duration: string,
    id: string,
    numberOfStops: number,
    blacklistedInEU: boolean
}


const FlightCard: React.FC<FlightCardProps> = ({ flightData }) => {
    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return duration;

        const hours = match[1] ? match[1].replace('H', 'h ') : '';
        const minutes = match[2] ? match[2].replace('M', 'm') : '';

        return `${hours}${minutes}`.trim();
    };

    return (
        <Card
            className="shadow-sm d-flex align-items-center"
            style={{ borderRadius: "10px", height: "100%" }}
        >
            <Row className="h-100 w-100 d-flex justify-content-between">
                <Col sm={12} md={8} className='p-3'>
                    {flightData.itineraries.map((itinerary, index) => (
                        <Row className='w-100'>
                            <Col sm={3} md={3} className="d-flex flex-column justify-content-center">
                                {itinerary.segments.map((segment, segmentIndex) => {
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
                                    <Col sm={4} md={4} className='text-end d-flex flex-column justify-content-center'>
                                        <span className='flight-time'>{itinerary.segments[0].departure.at.split("T")[1].substring(0, 5)}</span>
                                        <span className='flight-airline-iataCode'>{itinerary.segments[0].departure.iataCode}</span>
                                    </Col>
                                    <Col sm={5} md={5} className='text-center'>
                                        <span className='flight-duration'>{formatDuration(itinerary.duration)}</span>
                                        <div className='flight-path'>
                                            {itinerary.segments.map((segment, segmentIndex) => {
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
                                                    <span>{itinerary.segments.map((segment, index) => {
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
                                    <Col sm={3} md={3} className='text-start d-flex flex-column justify-content-center'>
                                        <span className='flight-time'>{itinerary.segments[itinerary.segments.length - 1].arrival.at.split("T")[1].substring(0, 5)}</span>
                                        <span className='flight-airline-iataCode'>{itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </Col>
                <Col sm={12} md={4} className='p-3 flight-pricing'>
                    <Row className='text-center'>
                        <span className='flight-base-price'>{flightData.travelerPricings[0].price.total} {flightData.travelerPricings[0].price.currency}</span>
                        <span className='flight-total-price'>{flightData.price.total} {flightData.price.currency} total</span>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default FlightCard;