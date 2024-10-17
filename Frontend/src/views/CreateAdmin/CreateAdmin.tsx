import React, { useEffect, useState } from "react";
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
  phone: string;
  password: string;
  retypePassword: string;
  username: string;
}

const CreateAdmin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    email: "",
    phone: "",
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
      phone: formData.phone,
      username: formData.username,
      password: formData.password,
    };
    await AdminService.createAdmin(data);
  };

  const handleCancel = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      phone: "",
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
                id="phone"
                name="phone"
                disabled={false}
                required={true}
                value={formData.phone}
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
            <Button type="submit" className="update-btn">
              Create admin
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default CreateAdmin;
