import BookingCard from "../components/Cards/BookingCard";
import { useAppSelector } from "../store/hooks";
import { TouristService } from "../services/TouristService";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Nav, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./ViewingPages/switch.css";

const MyBookings: React.FC = () => {
  const Tourist = useAppSelector((state) => state.user);
  const [bookings, setBookings] = useState<null | any[]>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // Track selected booking for modal

  const location = useLocation();
  const navigate = useNavigate();

  const fetchBookings = async (type: "upcoming" | "past") => {
    setLoading(true);
    setError("");
    setBookings(null); 
    try {
      const response =
        type === "upcoming"
          ? await TouristService.getUpcomingActivityBookings(Tourist.email)
          : await TouristService.getPastActivityBookings(Tourist.email);

      if (response && response.data) {
        setBookings(response.data);
      } else {
        setError(`Error: ${type} bookings data is missing`);
      }
    } catch (error: any) {
      console.error(`Error fetching ${type} bookings:`, error);
      setError(`Error fetching ${type} bookings: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "upcoming" || path === "past") {
      fetchBookings(path as "upcoming" | "past");
    } else {
      navigate("/MyBookings/upcoming");
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

  function handleCancelBooking(bookingId: string) {
    setSelectedBookingId(bookingId); // Set the bookingId to trigger modal for specific booking
    setShowModal(true); // Show the modal
  }

  return (
    <div className="ms-3">
    <Nav
      className="custom-tabs"
      defaultActiveKey="/MyBookings/upcoming"
    >
      <Nav.Item>
        <Nav.Link as={NavLink} to="/MyBookings/upcoming" className="tab-link">
          Upcoming Bookings
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/MyBookings/past" className="tab-link">
          Past Bookings
        </Nav.Link>
      </Nav.Item>
    </Nav>
      {Array.isArray(bookings) && bookings.length === 0 && !loading && (
        <p>No bookings found</p>
      )}
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
                {selectedBooking === index && location.pathname === "/MyBookings/upcoming" && (
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

      {/* Modal for cancel confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this activity?</p>
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

export default MyBookings;
