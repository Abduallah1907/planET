import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { AdminService } from "../../services/AdminService";
import "../FormGroup/FormGroup.css";

export default function ComplaintsModal(props: any) {
  const { complaint, onStatusChange } = props;

  const [reply, setReply] = useState("");

  if (!complaint) {
    return null;
  }

  const handleStatusChange = async () => {
    try {
      if (complaint.status === "Pending") {
        await AdminService.markResolved(complaint.complaint_id);
        onStatusChange(complaint.complaint_id, "Resolved");
      } else {
        await AdminService.markPending(complaint.complaint_id);
        onStatusChange(complaint.complaint_id, "Pending");
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      await AdminService.replyComplaint(complaint.complaint_id, reply);
      console.log("Reply Submitted");
    } catch (error) {
      console.error("Error submitting reply:", error);
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
          <Row className="pt-2">
            <Col xs={12} md={8}>
              <strong>Date:</strong> {complaint.date.toString()}
            </Col>
            <Col xs={6} md={4}>
              <strong>Status:</strong> {complaint.status}
            </Col>
          </Row>
          <Row className="pt-2">
            <Col xs={12} md={12}>
              <strong>Body:</strong> {complaint.body}
            </Col>
          </Row>
          <Row className="pt-3">
            <Col xs={12} md={8}>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Add a reply"
                value={reply}
                onChange={handleReplyChange}
              />
            </Col>
            <Col xs={6} md={4}>
              <Button
                type="submit"
                variant="main-inverse"
                disabled={!reply}
                onClick={handleReplySubmit}
              >
                Add reply
              </Button>
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
