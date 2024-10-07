import React, { useState } from "react";
import "../CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../../components/FormGroup/FormGroup";
import Logo from "../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import { AdminService } from "../../services/AdminService";

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

interface FormData {
  fname: string;
  lname: string;
  email: string;
  mobile: string;
  password: string;
  retypePassword: string;
  username: string;
  nationality: string;
}

const CreateGoverner: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fname:"",
    lname:"",
    email: "",
    mobile: "",
    password: "",
    retypePassword: "",
    username: "",
    nationality: "",
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
      fname:"",
      lname:"",
      email: "",
      mobile: "",
      password: "",
      retypePassword: "",
      username: "",
      nationality: "",
    });
  };

  
  const OnClick = async () => {
    await AdminService.CreateGoverner(formData);
      
  
  };

  return (
    <div className="profile-form-container">
      
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Create governer account</h2>
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
            <Col>
              <Form.Group className="form-group" controlId="nationality">
                <Form.Label>Nationality</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
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
              <AdminFormGroup
                label="Username"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                disabled={false}
                required={false}
                value={formData.username}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <AdminFormGroup
                label="Mobile Number"
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
          <Row>
  <Col xs={6}>
    <Form.Check
      type="checkbox"
      id="checkbox1"
      label="Remember me"
      name="terms"
      onChange={handleChange}
    />
    <Form.Check
      type="checkbox"
      id="checkbox2"
      label="I agree to all terms and privacy policy"
      name="newsletter"
      onChange={handleChange}
    />
  </Col>
</Row>

          <div className="form-actions">
            <Button type="submit" className="update-btn" onClick={OnClick}>
              Create governer
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default CreateGoverner;
