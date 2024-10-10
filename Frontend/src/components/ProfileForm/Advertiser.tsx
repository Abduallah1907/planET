import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import { AdvertiserService } from "../../services/AdvertiserService";
import { useAppSelector } from "../../store/hooks";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profession: string;
  password: string;
  retypePassword: string;
  username: string;
  nationality: string;
  dob: string;
  description: string;
  logo: File | null; // Added logo field
  about: string; // New 'About' field
}

const Advertiser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profession: "",
    password: "",
    retypePassword: "",
    username: "",
    nationality: "",
    dob: "",
    description: "",
    logo: null, // Initialize logo as null
    about: "", // Initialize about section
  });
  const Advertiser = useAppSelector((state) => state.user);

  useEffect(() => {
    setFormData({
      firstName: Advertiser.name?.split(" ")[0] || "",
      lastName: Advertiser.name?.split(" ")[1] || "", // Adding fallback if there's no last name
      email: Advertiser.email || "",
      mobile: Advertiser.phone_number || "",
      profession: Advertiser.stakeholder_id?.job || "", // Optional chaining to prevent errors
      password: "",
      retypePassword: "",
      username: Advertiser.username || "",
      nationality: Advertiser.stakeholder_id?.nation || "", // Optional chaining
      dob: Advertiser.stakeholder_id?.date_of_birth || "", // Optional chaining
      description: formData.description || "",
      logo: formData.logo || null,
      about: Advertiser.stakeholder_id?.about || formData.about || "", // Fallback to formData.about if unavailable
    });
  }, [Advertiser, formData.description, formData.logo, formData.about]);

  const OnClick = async () => {
    await AdvertiserService.updateAdvertiser(Advertiser.email, {
      name: formData.firstName + " " + formData.lastName,
      newEmail: formData.email,
      /*password: formData.password,*/
      About: formData.about,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
    // Handle form submission, including the logo file and about text
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      profession: "",
      password: "",
      retypePassword: "",
      username: "",
      nationality: "",
      dob: "",
      description: "",
      logo: null, // Reset logo
      about: "", // Reset about section
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Hi Advertiser!</h2>
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

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="First Name"
                type="text"
                placeholder="Enter your First Name"
                id="firstName"
                name="firstName"
                disabled={false}
                required={true}
                value={formData.firstName}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Last Name:"
                type="text"
                placeholder="Enter your Last Name"
                id="lastName"
                name="lastName"
                disabled={false}
                required={true}
                value={formData.lastName}
                onChange={handleChange}
              />
            </Col>
          </Row>
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

          <Row>
            <Col>
              <CustomFormGroup
                label="About:"
                type="text"
                placeholder="About"
                id="description"
                name="description"
                disabled={false}
                required={true}
                value={formData.description} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* New row for logo upload */}
          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <h3>Upload Seller Logo</h3> {/* Added 'Seller Logo' label */}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* New row for 'About' section */}

          <div className="form-actions">
            <Button type="submit" className="update-btn" onClick={OnClick}>
              Confirm
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

export default Advertiser;
