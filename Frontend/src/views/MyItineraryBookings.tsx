import BookingCard from "../components/Cards/BookingCard";
import { useAppSelector } from "../store/hooks";
import { TouristService } from "../services/TouristService";
import { useEffect, useState } from "react";
import { Button, Col, Nav, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./mybookings.css";

const MyItineraryBookings: React.FC = () => {
  const Tourist = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<null | any[]>(null); // Set initial state to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchBookings = async (type: "upcoming" | "past") => {
    setLoading(true);
    setError("");
    setBookings(null); // Reset bookings to null immediately to indicate loading/resetting
    try {
      const response =
        type === "upcoming"
          ? await TouristService.getUpcomingItineraryBookings(Tourist.email)
          : await TouristService.getPastItineraryBookings(Tourist.email);

      if (response && response.data) {
        setBookings(response.data);
      } else {
        setError(`Error: ${type} bookings data is missing`);
      }
    } catch (error: any) {
      console.error(`Error fetching ${type} bookings:`, error);
      setError(
        `Error fetching ${type} bookings: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "upcoming" || path === "past") {
      fetchBookings(path as "upcoming" | "past");
    } else {
      navigate("/MyItineraryBookings/upcoming");
    }
  }, [location.pathname, Tourist.email, navigate]);
  const handleCardClick = (bookingId: number) => {
    setSelectedBooking((prevSelectedBooking) =>
      prevSelectedBooking === bookingId ? null : bookingId
    );
  };
  const cancelTicket = async (tourist_id: string, ticket_id: string) => {
    try {
      const response = await TouristService.cancelTicket(tourist_id, ticket_id);
      if (response && response.data) {
        fetchBookings("upcoming");
      } else {
        setError("Error cancelling ticket: No response data");
      }
    } catch (error: any) {
      setError(`Error cancelling ticket: ${error.message || "Unknown error"}`);
    }
  };
  return (
    <div>
      <Nav
        className="bookingTabs"
        defaultActiveKey="/MyItineraryBookings/upcoming"
      >
        <Nav.Item>
          <Nav.Link as={NavLink} to="/MyItineraryBookings/upcoming">
            Upcoming Itineraries
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/MyItineraryBookings/past">
            Past Itineararies
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {bookings && bookings.length === 0 && <p>No bookings found</p>}
      {bookings && bookings.length > 0 && (
        <Row className="w-100">
          {Array.isArray(bookings) &&
            bookings.map((booking: any, index: number) => (
              <Col sm={12} md={3} key={index}>
                <div onClick={() => handleCardClick(index)}>
                  <BookingCard
                    id={String(index)}
                    Name={booking.booking_name}
                    Price={booking.price}
                    Date_Time={booking.time_to_attend.toLocaleString()}
                  />
                  {selectedBooking === index && (
                    <Button
                      variant="danger"
                      onClick={() =>
                        cancelTicket(
                          Tourist.stakeholder_id._id,
                          booking.ticket_id
                        )
                      }
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Col>
            ))}
        </Row>
      )}
    </div>
  );
};

export default MyItineraryBookings;
