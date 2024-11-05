import BookingCard from "../components/Cards/BookingCard";
import { useAppSelector } from "../store/hooks";
import { TouristService } from "../services/TouristService";
import { useEffect, useState } from "react";
import { Button, Col, Nav, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import './mybookings.css';

const MyBookings: React.FC = () => {
    const Tourist = useAppSelector((state) => state.user);
    const [bookings, setBookings] = useState<null | any[]>(null);  // Set initial state to null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchBookings = async (type: 'upcoming' | 'past') => {
        setLoading(true);
        setError('');
        setBookings(null);  // Reset bookings to null immediately to indicate loading/resetting
        try {
            const response = 
                type === 'upcoming'
                ? await TouristService.getUpcomingActivityBookings(Tourist.email)
                : await TouristService.getPastActivityBookings(Tourist.email);

            console.log(`Response for ${type} bookings:`, response);

            if (response && response.data) {
                setBookings(response.data);
            } else {
                setError(`Error: ${type} bookings data is missing`);
            }
        } catch (error: any) {
            console.error(`Error fetching ${type} bookings:`, error);
            setError(`Error fetching ${type} bookings: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        if (path === 'upcoming' || path === 'past') {
            fetchBookings(path as 'upcoming' | 'past');
        } else {
            navigate('/MyBookings/upcoming');
        }
    }, [location.pathname, Tourist.email, navigate]);

    const handleCardClick = (bookingId: number) => {
        setSelectedBooking((prevSelectedBooking) =>
            prevSelectedBooking === bookingId ? null : bookingId
        );
    };

    const cancelTicket = async (tourist_id: string, booking_id: string) => {
        try {
            await TouristService.cancelTicket(tourist_id, booking_id);
            console.log("Ticket Cancelled");
            setBookings((prev) => prev?.filter((booking: any) => booking.booking_id !== booking_id) || []);
        } catch (error) {
            console.error('Error cancelling ticket:', error);
        }
    };

    return (
        <div>
            <Nav className="bookingTabs" defaultActiveKey="/upcoming">
                <Nav.Item>
                    <NavLink to="/MyBookings/upcoming" className="nav-link">
                        Upcoming Activities
                    </NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/MyBookings/past" className="nav-link">
                        Past Activities
                    </NavLink>
                </Nav.Item>
            </Nav>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {bookings === null && !loading && <p>Loading new data...</p>}
            {Array.isArray(bookings) && bookings.length === 0 && !loading && <p>No bookings found</p>}
            <Row className="w-100">
                {Array.isArray(bookings) && bookings.map((booking: any, index: number) => (
                    <Col sm={12} md={3} key={index}>
                        <div onClick={() => handleCardClick(index)}>
                            <BookingCard
                                id={String(index)}
                                Name={booking.booking_name}
                                Price={booking.price}
                                Date_Time={booking.time_to_attend.toLocaleString()}                            />
                            {selectedBooking === index && (
                                <Button
                                    variant="danger"
                                    onClick={() => cancelTicket(booking.tourist_id, booking.booking_id)}
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default MyBookings;
