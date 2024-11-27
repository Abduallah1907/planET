import React, { useEffect, useState } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

const BookmarkEvents: React.FC = () => {
  const tourist = useAppSelector((state) => state.user);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBookmarkedEvents = async () => {
    try {
      if (!tourist || !tourist.email) {
        setErrorMessage("User email not found.");
        return;
      }

      const response = await TouristService.getBookmarkedActivities(
        tourist.email
      );
      console.log(response.data);

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

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-start"
      style={{ minHeight: "100vh", paddingTop: "2rem" }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#495057" }}>
        Bookmark Events
      </h1>

      {errorMessage && (
        <Alert variant="danger" className="w-100 text-center">
          {errorMessage}
        </Alert>
      )}

      {bookmarkedEvents.length > 0 ? (
        bookmarkedEvents.map((event) => (
          <Card
            key={event.id}
            className="mb-3 p-3 shadow-sm"
            style={{ borderRadius: "10px", width: "80%" }}
          >
            <Card.Body>
              <h5>{event.name}</h5>
              <p className="text-muted">{event.location._id}</p>
              <p className="text-muted">{event.date}</p>
              <p>{event.description}</p>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted">No bookmarked events found.</p>
      )}
    </Container>
  );
};

export default BookmarkEvents;
