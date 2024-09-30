import React from "react";
//import Form from "react-bootstrap/Form";
//import Button from "react-bootstrap/Button";
import { Form, Button, Row, Col } from "react-bootstrap";
//import { useNavigate } from "react-router-dom";

function CreateAdmin() {
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="mb-4">Create admin account</h2>

      <Row>
        {/* Email Address on the Left */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>First name</Form.Label>
            <Form.Control type="name" placeholder="Enter First name" />
          </Form.Group>
        </Col>

        {/* Password on the Right */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Last name</Form.Label>
            <Form.Control type="name " placeholder="Enter Last name" />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/* Email Address on the Left */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
        </Col>

        {/* Password on the Right */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Phone number </Form.Label>
            <Form.Control type="number" placeholder="Enter phone number" />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {/*  Password */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label> Password</Form.Label>
            <Form.Control type="password" placeholder="Enter Password" />
          </Form.Group>
        </Col>

        {/* Confirm password */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label> Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Please confirm your password"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBasicCheckbox1">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox2">
            <Form.Check
              type="checkbox"
              label="I agree to all Terms and Privacy Policy"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button variant="primary" type="submit" className="btn-lg">
          Create account
        </Button>
      </div>

      <div className="text-center mt-3">
        <p>
          Already have an account? <a href="/login">Login here</a>.
        </p>
      </div>
    </Form>
  );
}

export default CreateAdmin;
