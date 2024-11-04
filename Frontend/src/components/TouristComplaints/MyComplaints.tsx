import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import TouristComplaintsTable from "./TouristComplaintsTable";

export default function MyComplaints() {
  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            My Complaints
          </h1>
        </Col>
      </Row>
      <TouristComplaintsTable />
    </Container>
  );
}
