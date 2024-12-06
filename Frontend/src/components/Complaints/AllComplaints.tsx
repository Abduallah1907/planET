import { Col, Container, Row } from "react-bootstrap";
import ComplaintsTable from "./ComplaintsTable";

export default function AllComplaints() {
  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col md={6} className="text-center">
          <h1 className="fw-bold" style={{ fontFamily: "Poppins" }}>
            All Complaints
          </h1>
        </Col>
      </Row>
      <ComplaintsTable />
    </Container>
  );
}
