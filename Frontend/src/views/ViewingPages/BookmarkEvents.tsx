import React, { useEffect, useMemo, useState } from "react";
import { Container, Table, Badge, Alert, Row, Col } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Rating from "../../components/Rating/Rating"; // Assuming Rating is imported from a separate component
import ActivityCard from "../DetailsPages/ActivityCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
//import "./Cards.css";

const BookmarkEvents: React.FC = () => {
  const navigate = useNavigate();
  const tourist = useAppSelector((state) => state.user);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const fetchBookmarkedEvents = async () => {
    try {
      if (!tourist || !tourist.email) {
        setErrorMessage("User email not found.");
        return;
      }

      const response = await TouristService.getBookmarkedActivities(
        tourist.email
      );

      if (response?.data && response.data.length > 0) {
        setBookmarkedEvents(response.data);
        setErrorMessage(null);
      } else {
        setBookmarkedEvents([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarked events:", error);
      setErrorMessage(
        "Error fetching bookmarked events. Please try again later."
      );
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
        <div
          className="d-flex flex-wrap justify-content-center" // Flexbox container for wrapping
          style={{
            gap: "15px", // Space between the cards
          }}
        >
          {bookmarkedEvents.map((event) => {
            const convertedPrice = getConvertedCurrencyWithSymbol(
              event.price,
              baseCurrency,
              currency
            );
            return (
              <div
                onClick={() => navigate(`/Activity/${event._id}`)} // Use the event's ID to navigate to the details page
                className="activity-card"
                key={event._id}
                style={{
                  width: "450px", // Adjust width for smaller cards
                  margin: "10px", // Space between cards
                  padding: "15px", // Add some padding
                  border: "1px solid #ddd", // Add a border
                  borderRadius: "8px", // Round the corners
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
                  fontFamily: "Poppins", // Use the Poppins font
                }}
              >
                <div className="activity-details">
                  <div
                    className="image-placeholder"
                    style={{
                      width: "150px", // Placeholder width
                      height: "150px", // Placeholder height
                      backgroundColor: "#f0f0f0", // Light gray background
                      margin: "0 auto 10px", // Center align with spacing below
                      borderRadius: "8px", // Rounded corners
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    Image Placeholder
                  </div>

                  <div className="details">
                    <h2 className="fw-bold" style={{ fontFamily: "Poppins" }}>
                      {event.name}
                    </h2>
                    <p className="category">{event.category.type}</p>
                    <p className="date">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="price">{convertedPrice}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center">No bookmarked events found.</p>
      )}
    </Container>
  );
};

export default BookmarkEvents;
