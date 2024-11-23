import React from "react";
import { Card, Container } from "react-bootstrap";

const BookmarkEvents: React.FC = () => {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-start"
      style={{ minHeight: "100vh", paddingTop: "2rem" }} 
    >
      {/* Header Title */}
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#495057" }}>
        Bookmark Events
      </h1>

      {/* Top Card */}
      <Card className="mb-3 p-3 shadow-sm" style={{ borderRadius: "10px", width: "80%" }}>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <p className="text-muted"> Card 1</p>
        </Card.Body>
      </Card>

      {/* Middle Card */}
      <Card className="mb-3 p-3 shadow-sm" style={{ borderRadius: "10px", width: "80%" }}>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <p className="text-muted"> Card 2</p>
        </Card.Body>
      </Card>

      {/* Bottom Card */}
      <Card className="p-3 shadow-sm" style={{ borderRadius: "10px", width: "80%" }}>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <p className="text-muted"> Card 3</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookmarkEvents;
