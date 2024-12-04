import BookingCard from "../components/Cards/BookingCard";
import { useAppSelector } from "../store/hooks";
import { TouristService } from "../services/TouristService";
import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Nav, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./ViewingPages/switch.css"

const MyItineraryBookings: React.FC = () => {
  const Tourist = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<null | any[]>(null); // Set initial state to null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // Track selected booking for modal

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
      } 
    } catch (error: any) {
      setError(`Error cancelling ticket: ${error.message || "Unknown error"}`);
    }
  };
  function handleCancelBooking(bookingId: string) {
    setSelectedBookingId(bookingId); // Set the bookingId to trigger modal for specific booking
    setShowModal(true); // Show the modal
  }

  return (
    <div className="ms-3">
      <Nav
        className="custom-tabs"
        defaultActiveKey="/MyItineraryBookings/upcoming"
      >
        <Nav.Item>
          <Nav.Link as={NavLink} to="/MyItineraryBookings/upcoming" className="tab-link">
            Upcoming Itineraries
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/MyItineraryBookings/past" className="tab-link">
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
                   {selectedBooking === index && location.pathname === "/MyItineraryBookings/upcoming" && (
                    <Button
                      className="cancelBookingBtn"
                      variant="danger"
                      onClick={() => handleCancelBooking(booking.ticket_id)}

                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Col>
            ))}
        </Row>
        
        
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this itinerary?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="main" className="border-warning-subtle"  onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="main-inverse"
            onClick={() => {
              if (selectedBookingId) {
                cancelTicket(Tourist.stakeholder_id._id, selectedBookingId);
                setShowModal(false);
              }
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyItineraryBookings;
