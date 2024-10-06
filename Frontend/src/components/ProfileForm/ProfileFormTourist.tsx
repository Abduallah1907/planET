import React, { useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

interface FormData {
  email: string;
  mobile: string;
  profession: string;
  password: string;
  retypePassword: string;
  username: string;
  nationality: string;
  dob: string;
}

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    mobile: "",
    profession: "",
    password: "",
    retypePassword: "",
    username: "",
    nationality: "",
    dob: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      mobile: "",
      profession: "",
      password: "",
      retypePassword: "",
      username: "",
      nationality: "",
      dob: "",
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">My Profile</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={Logo}
            width="70"
            height="50"
            className="align-top logo"
            alt="Travel Agency logo"
          />
        </Col>
      </Row>

      <div className="wallet-card">
        <h3>Wallet</h3>
        <p>$400</p>
      </div>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="Email:"
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
            <Col>
              <CustomFormGroup
                label="Username:"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                disabled={true}
                required={false}
                value={formData.username}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Mobile Number:"
                type="tel"
                placeholder="Enter your mobile number"
                id="mobile"
                name="mobile"
                disabled={false}
                required={true}
                value={formData.mobile}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="nationality">
                <Form.Label>Nationality:</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="custom-form-control"
                    required
                  >
                    <option value="">Select your nationality</option>
                    {nationalityOptions.map((option: NationalityOption) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />{" "}
                  {/* Dropdown icon */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Profession:"
                type="text"
                placeholder="Enter your profession"
                id="profession"
                name="profession"
                disabled={false}
                required={false}
                value={formData.profession}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Date of Birth (MM/DD/YY):"
                type="text"
                placeholder="Enter your date of birth"
                id="dob"
                name="dob"
                disabled={true}
                required={false}
                value={formData.dob}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Password:"
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
              <CustomFormGroup
                label="Retype Password:"
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

          <div className="form-actions">
            <Button type="submit" className="update-btn">
              Update
            </Button>
            <Button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ProfileForm;
