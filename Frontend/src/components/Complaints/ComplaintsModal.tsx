import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { AdminService } from "../../services/AdminService";
import "../FormGroup/FormGroup.css";
import { Utils } from "../../utils/utils";

export default function ComplaintsModal(props: any) {
  const { complaint, onStatusChange } = props;

  const [reply, setReply] = useState("");

  useEffect(() => {
    if (complaint) {
      setReply(complaint.reply || ""); // Set reply to complaint.reply if it exists
    }
  }, [complaint]);

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
      setReply("");
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
            <Col xs={6} md={6}>
              <strong>Name:</strong> {complaint.tourist_name.user_id.name}
            </Col>
            <Col xs={6} md={6}>
              <strong>Title:</strong> {complaint.title}
            </Col>
          </Row>
          <Row className="pt-2">
            <Col xs={6} md={6}>
              <strong>Date:</strong>{" "}
              {Utils.formatDateDay(new Date(complaint.date))}
            </Col>
            <Col xs={6} md={6}>
              <strong>Filed At:</strong>{" "}
              {Utils.formatDateDay(new Date(complaint.createdAt))}
            </Col>
          </Row>
          <Row className="pt-2">
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
            
            {complaint.status !== "Resolved" && (
            <Button
              type="submit"
              variant="main-inverse"
              onClick={handleReplySubmit}
            >
              Add reply
            </Button>
          )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="main-inverse"
          onClick={() => {
            handleStatusChange();
            props.onHide();
          }}
          style={{
            backgroundColor:
              complaint.status === "Pending"
                ? "rgb(89, 232, 103)"
                : "rgb(232, 89, 89)",
            color: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {complaint.status === "Pending"
            ? "Mark as Resolved"
            : "Mark as Pending"}
        </Button>
        <Button variant="main" className="border-warning-subtle" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
