import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { SellerServices } from "../../services/SellerServices";
import { FileService } from "../../services/FileService";
import { isValidObjectId } from "../..//utils/CheckObjectId";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  retypePassword: string;
  username: string;
  description: string;
  logo: File | null;
}

const SellerProfile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    retypePassword: "",
    username: "",
    description: "",
    logo: null, // Initialize logo as null
  });
  const [fileUrl, setFileUrl] = useState("");
  const Seller = useAppSelector((state) => state.user);

  const getSellerData = async () => {
    if (
      Seller.stakeholder_id.logo &&
      isValidObjectId(Seller.stakeholder_id.logo)
    ) {
      const file = await FileService.downloadFile(Seller.stakeholder_id.logo);

      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFormData({
        firstName: Seller.name?.split(" ")[0] || "",
        lastName: Seller.name?.split(" ")[1] || "",
        email: Seller.email || "",
        mobile: Seller.phone_number || "",
        password: "",
        retypePassword: "",
        username: Seller.username || "",
        logo: file.data || null,
        description: Seller.stakeholder_id?.description || "",
      });
    } else {
      setFormData({
        firstName: Seller.name?.split(" ")[0] || "",
        lastName: Seller.name?.split(" ")[1] || "",
        email: Seller.email || "",
        mobile: Seller.phone_number || "",
        password: "",
        retypePassword: "",
        username: Seller.username || "",
        logo: null,
        description: Seller.stakeholder_id?.description || "",
      });
    }
  };

  useEffect(() => {
    getSellerData();
  }, [Seller]);

  const OnClick = async () => {
    if (formData.logo) {
      const file = await FileService.uploadFile(formData.logo);
      const seller = await SellerServices.updateSellerServices(Seller.email, {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        username: formData.username,
        description: formData.description,
        phone_number: formData.mobile,
        password: formData.password,
        logo: file.data._id,
      });
      if (seller.status === 200) {
        showToast("Updated successfully", ToastTypes.SUCCESS);
      } else {
        showToast("Error in updating", ToastTypes.ERROR);
      }
    } else {
      const seller = await SellerServices.updateSellerServices(Seller.email, {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        username: formData.username,
        description: formData.description,
        phone_number: formData.mobile,
        password: formData.password,
      });
      if (seller.status === 200)
        showToast("Updated successfully", ToastTypes.SUCCESS);
      else showToast("Error in updating", ToastTypes.ERROR);
    }
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
    if (
      (formData.password && !formData.retypePassword) ||
      (!formData.password && formData.retypePassword)
    ) {
      alert("Please fill out both password fields.");
      return;
    }

    // If both password fields are filled, validate that they match
    if (formData.password && formData.retypePassword) {
      if (formData.password !== formData.retypePassword) {
        alert("Passwords don't match!");
        return;
      }
    }
    // Handle form submission, including the logo file
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      retypePassword: "",
      username: "",
      description: "",
      logo: null, // Reset logo
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Welcome Seller!</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={fileUrl != "" ? fileUrl : Logo}
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
            <Col>
              <CustomFormGroup
                label="Username:"
                type="username"
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
                label="Chnage your password"
                type="password"
                placeholder="Change your password"
                id="password"
                name="password"
                disabled={false}
                required={false}
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
                required={false}
                value={formData.retypePassword}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Description:"
                type="text"
                placeholder="Enter your description"
                id="description"
                name="description"
                disabled={false}
                required={true}
                value={formData.description} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomFormGroup
                label="Mobile Number"
                type="text"
                placeholder="Enter your mobile number"
                id="mobile"
                name="mobile"
                disabled={false}
                required={true}
                value={formData.mobile} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* New row for logo upload */}
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
            <Button type="submit" className="update-btn" onClick={OnClick}>
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

export default SellerProfile;
