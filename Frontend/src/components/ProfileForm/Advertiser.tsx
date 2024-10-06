import React, { useState } from "react";
import TopBar from "../TopBar"; // Adjust the path as necessary
import "./Advertiser.css"; // Make sure this includes your CSS
import CustomFormGroup from "../FormGroup";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Sidebar from "../Sidebar";

interface FormData {
  website: string;
  hotline: string;
  companyProfile: string;
  password: string;
  retypePassword: string;
}

const Advertiser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    website: "",
    hotline: "",
    companyProfile: "",
    password: "",
    retypePassword: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items for the advertiser's form
  const advertiserNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/advertiser", label: "Profile" },
    { path: "/campaigns", label: "Campaigns" },
    { path: "/settings", label: "Settings" },
  ];

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
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      website: "",
      hotline: "",
      companyProfile: "",
      password: "",
      retypePassword: "",
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="profile-form-container">
      <TopBar onToggleSidebar={toggleSidebar} />
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          navItems={advertiserNavItems} // Pass the dynamic nav items
        />
      </div>
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <Row className="align-items-center mb-4">
          <Col xs={9} className="text-left">
            <h2 className="my-profile-heading">Hi Advertiser</h2>
          </Col>
          <Col xs={1} className="text-center">
            <img
              src={Logo}
              width="70"
              height="50"
              className="align-top logo"
              alt="Company logo"
            />
          </Col>
        </Row>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Website Link"
                  type="url"
                  placeholder="Enter the link to your website"
                  id="website"
                  name="website"
                  required
                  value={formData.website}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Hotline"
                  type="tel"
                  placeholder="Enter your hotline number"
                  id="hotline"
                  name="hotline"
                  required
                  value={formData.hotline}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Company Profile"
                  type="text"
                  placeholder="Describe your company profile"
                  id="companyProfile"
                  name="companyProfile"
                  value={formData.companyProfile}
                  onChange={handleChange}
                  className="company-profile-input"
                  disabled={false}
                  required={false}
                />
              </Col>
            </Row>
            <div className="form-actions">
              <Button type="submit" className="update-btn">
                Update
              </Button>
              <Button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Advertiser;
