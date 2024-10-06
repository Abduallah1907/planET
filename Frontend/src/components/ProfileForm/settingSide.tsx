import React, { useState } from "react";
import "./SellerProfile.css"; // Make sure this includes your CSS

import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Sidebar from "../SideBar/Sidebar";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector,useAppDispatch } from "../../store/hooks";
import { toggleSidebar } from "../../store/sidebarSlice";

interface FormData {
  email: string;
  mobile: string;
  description: string;
  password: string;
  retypePassword: string;
  username: string;
  nationality: string;
  dob: string;
}

const SettingSide: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    mobile: "",
    description: "",
    password: "",
    retypePassword: "",
    username: "",
    nationality: "",
    dob: "",
  });

  // Define the navigation items for the Settings page
  const settingsNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/sellerprofile", label: "My Profile" },
    { path: "/products", label: "Products" },
    { path: "/settingSide", label: "Settings & Privacy" },
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
      email: "",
      mobile: "",
      description: "",
      password: "",
      retypePassword: "",
      username: "",
      nationality: "",
      dob: "",
    });
  };

  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen)
  const dispatch = useAppDispatch()

  return (
    <div className="profile-form-container">
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={()=>dispatch(toggleSidebar())}
          navItems={settingsNavItems} // Pass the settings nav items
        />
      </div>
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <Row className="align-items-center mb-4">
          <Col xs={9} className="text-left">
            <h2 className="my-profile-heading">Hi Seller</h2>
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
            </Row>
            <Row>
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
                Change
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

export default SettingSide;
