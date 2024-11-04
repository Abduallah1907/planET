import React, { useEffect, useState } from "react";
import "../CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../../components/FormGroup/FormGroup";
import Logo from "../assets/person-circle.svg";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import { AdminService } from "../../services/AdminService";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

interface FormData {
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  password: string;
  retypePassword: string;
  username: string;
}

const CreateAdmin: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true); // <-- New handler to show modal
  const handleCloseModal = () => setShowModal(false);
  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    password: "",
    retypePassword: "",
    username: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
    const data = {
      email: formData.email,
      name: formData.fname + " " + formData.lname,
      phone_number: formData.phone_number,
      username: formData.username,
      password: formData.password,
    };
    await AdminService.createAdmin(data);
    showToast("Admin created successfully", ToastTypes.SUCCESS);
  };

  const handleCancel = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      phone_number: "",
      password: "",
      retypePassword: "",
      username: "",
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Create admin account</h2>
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <AdminFormGroup
                label="First name"
                type="name"
                placeholder="Enter your first name"
                id="fname"
                name="fname"
                disabled={false}
                required={true}
                value={formData.fname}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Last name"
                type="text"
                placeholder="Enter your last name"
                id="lname"
                name="lname"
                disabled={false}
                required={true}
                value={formData.lname}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Email"
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                disabled={false}
                required={true}
                value={formData.email}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Username"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                disabled={false}
                required={true}
                value={formData.username}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                id="phone_number"
                name="phone_number"
                disabled={false}
                required={true}
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AdminFormGroup
                label="Password"
                type="password"
                placeholder="Enter your password"
                id="password"
                name="password"
                disabled={false}
                required={true}
                value={formData.password}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Confirm Password"
                type="password"
                placeholder="Retype your password"
                id="retypePassword"
                name="retypePassword"
                disabled={false}
                required={true}
                value={formData.retypePassword}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <div key="default-checkbox1" className="mb-4">
            <Form.Check
              type="checkbox"
              label={
                <span>
                  I agree to all the{" "}
                  <a href="#" onClick={handleShowModal} className="terms-link">
                    {" "}
                    {/* <-- Updated to open modal */}
                    Terms & Conditions
                  </a>{" "}
                </span>
              }
              required
            />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="main-inverse">
              Create Admin
            </Button>
          </div>
        </Form>
        {/* Terms and Conditions Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Terms & Conditions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Terms & Conditions</h5>
            <p>
              By using this service, you agree to the following terms and
              conditions:
            </p>
            <ul>
              <li>You must be at least 18 years old to use this service.</li>
              <li>
                All information provided by you must be accurate and complete.
              </li>
              <li>
                We reserve the right to modify or terminate the service for any
                reason.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account.
              </li>
              <li>
                Any violation of these terms may result in termination of your
                account.
              </li>
            </ul>
            <p>
              For more detailed information, please contact our support team.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="main" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default CreateAdmin;
