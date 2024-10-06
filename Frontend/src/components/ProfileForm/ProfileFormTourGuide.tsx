import React, { useState } from "react";
import TopBar from "../TopBar"; // Adjust the path as necessary
import "./ProfileFormTourist.css"; // Make sure this includes your CSS

import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import Sidebar from "../Sidebar";
import CustomFormGroup from "../FormGroup/FormGroup";

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

interface FormData {
  mobile: string;
  yearsOfExperience: string;
  previousWork: string;
  password: string;
  retypePassword: string;
  nationality: string;
  dob: string;
}

const ProfileFormTourGuide: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mobile: "",
    yearsOfExperience: "",
    previousWork: "",
    password: "",
    retypePassword: "",
    nationality: "",
    dob: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items for the tour guide form
  const tourGuideNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/TourGuide", label: "Profile" },
    { path: "/jobs", label: "Jobs" },
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
      mobile: "",
      yearsOfExperience: "",
      previousWork: "",
      password: "",
      retypePassword: "",
      nationality: "",
      dob: "",
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
          navItems={tourGuideNavItems} // Pass the dynamic nav items
        />
      </div>
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <Row className="align-items-center mb-4">
          <Col xs={9} className="text-left">
            <h2 className="my-profile-heading">Hi Tour Guide</h2>
          </Col>
          <Col xs={1} className="text-center">
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
                  label="Mobile Number"
                  type="tel"
                  placeholder="Enter your mobile number"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Years of Experience"
                  type="number"
                  placeholder="Enter your years of experience"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  required
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Previous Work (if exists)"
                  type="text"
                  placeholder="Describe your previous work"
                  id="previousWork"
                  name="previousWork"
                  value={formData.previousWork}
                  onChange={handleChange}
                  className="previous-work-input"
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

export default ProfileFormTourGuide;
