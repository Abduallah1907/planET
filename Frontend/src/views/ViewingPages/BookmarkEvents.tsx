import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Alert, Row, Col } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Rating from "../../components/Rating/Rating"; // Assuming Rating is imported from a separate component


const BookmarkEvents: React.FC = () => {
  const tourist = useAppSelector((state) => state.user);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const fetchBookmarkedEvents = async () => {
    try {
      if (!tourist || !tourist.email) {
        setErrorMessage("User email not found.");
        return;
      }

      const response = await TouristService.getBookmarkedActivities(tourist.email);

      if (response?.data && response.data.length > 0) {
        setBookmarkedEvents(response.data);
        setErrorMessage(null);
      } else {
        setBookmarkedEvents([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarked events:", error);
      setErrorMessage("Error fetching bookmarked events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBookmarkedEvents();
  }, [tourist]);

  const handleBookmarkToggle = (eventId: string) => {
    setIsBookmarked(!isBookmarked);
    // Handle bookmark toggle logic for individual events
  };

  return (
    <Container className="mt-5">
        <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            Bookmarked Events
          </h1>
        </Col>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {bookmarkedEvents.length > 0 ? (
        <div className="d-flex flex-column">
          {bookmarkedEvents.map((event) => (
            <div
              className="activity-card w-75"
              key={event.id}
              style={{
                width: '300px', // Adjust the width as needed
                margin: '10px auto', // Center the card and add some margin
                padding: '15px', // Add some padding
                border: '1px solid #ddd', // Add a border
                borderRadius: '8px', // Round the corners
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                fontFamily: 'Poppins', // Use the Poppins font
              }}
            >
              <div className="activity-details">
                <div className="image-placeholder">
                  {/* Placeholder image */}
               
                </div>

                <div className="details">
                  <h2 className="fw-bold" style={{ fontFamily: "Poppins" }}>{event.name}</h2>
                  <div className="activity-tags">
                  </div>
                  <p className="category"> {event.category}</p>
                  <p className="date">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="price">E£ {event.price}</p>
                  <div className="d-flex justify-content-between mt-3">
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No bookmarked events found.</p>
      )}
    </Container>
  );
};

export default BookmarkEvents;
