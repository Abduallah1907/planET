import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { AdminService } from "../../services/AdminService";

export default function ComplaintsModal(props: any) {
  const { complaint, onStatusChange } = props;

  if (!complaint) {
    return null; // or you can return a loading state/modal
  }

  const handleStatusChange = async () => {
    try {
      if (complaint.status === "Pending") {
        await AdminService.markResolved(complaint.complaint_id); // Assuming complaint_id is the identifier
        // Optionally, call onStatusChange to update local state in the parent component
        onStatusChange(complaint.complaint_id, "Resolved");
      } else {
        await AdminService.markPending(complaint.complaint_id);
        // Optionally, call onStatusChange to update local state in the parent component
        onStatusChange(complaint.complaint_id, "Pending");
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Complaint Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <Row>
            <Col xs={12} md={8}>
              <strong>Name:</strong> {complaint.tourist_name.user_id.name}
            </Col>
            <Col xs={6} md={4}>
              <strong>Title:</strong> {complaint.title}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
              <strong>Date:</strong> {complaint.date.toString()}
            </Col>
            <Col xs={6} md={4}>
              <strong>Status:</strong> {complaint.status}
            </Col>
            <Col xs={6} md={4}>
              {/* .col-xs-6 .col-md-4 */}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            handleStatusChange();
            props.onHide();
          }}
        >
          {complaint.status === "Pending" ? "Resolved" : "Mark as Pending"}
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
