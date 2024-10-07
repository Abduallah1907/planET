import React, { useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import LogoPlaceholder from "../../assets/person-circle.svg"; // Placeholder logo

interface FormData {
  username: string;
  website: string;
  hotline: string;
  companyProfile: string;
  logo: File | null; // Added logo field
}

const Advertiser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    website: "",
    hotline: "",
    companyProfile: "",
    logo: null, // Initialize logo as null
  });

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
    // Handle form submission, including the logo file
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      website: "",
      hotline: "",
      companyProfile: "",
      logo: null, // Reset logo
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Welcome Advertiser!</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={LogoPlaceholder}
            width="70"
            height="50"
            className="align-top logo"
            alt="Advertiser logo"
          />
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="Username:"
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
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Link to Website:"
                type="url"
                placeholder="Enter your website URL"
                id="website"
                name="website"
                disabled={false}
                required={true}
                value={formData.website}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Hotline:"
                type="tel"
                placeholder="Enter your hotline number"
                id="hotline"
                name="hotline"
                disabled={false}
                required={true}
                value={formData.hotline}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Company Profile:"
                type="textarea"
                placeholder="Enter your company profile"
                id="companyProfile"
                name="companyProfile"
                disabled={false}
                required={true}
                value={formData.companyProfile}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <h3>Upload Logo</h3>
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

export default Advertiser;
