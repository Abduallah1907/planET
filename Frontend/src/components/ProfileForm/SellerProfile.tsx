import React, { useState } from "react";
import "./SellerProfile.css"; // Make sure this includes your CSS

import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import Sidebar from "../SideBar/Sidebar";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector,useAppDispatch } from "../../store/hooks";
import { toggleSidebar } from "../../store/sidebarSlice";

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

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

const SellerProfile: React.FC = () => {
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

  const sellerNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/sellerprofile", label: "Profile" },
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
          navItems={sellerNavItems} // Pass the dynamic nav items
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
              alt="Logo"
            />
          </Col>
        </Row>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomFormGroup
                  label="Description"
                  type="text"
                  placeholder="Enter your description"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="description-input"
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

export default SellerProfile;
