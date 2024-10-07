import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import LogoPlaceholder from "../../assets/person-circle.svg"; // Placeholder logo import
import { SellerServices } from "../../services/SellerServices";
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
}

const SellerFirstProfile: React.FC = () => {
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
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null); // For previewing the logo
  const SellerFirst = useAppSelector((state) => state.user);
  useEffect(() => {
    setFormData({
      firstName: SellerFirst.name.split(" ")[0],
      lastName: SellerFirst.name.split(" ")[1] || "",
      email: SellerFirst.email,
      mobile: SellerFirst.phone_number,
      profession: SellerFirst.stakeholder_id?.job || "",
      password: "",
      retypePassword: "",
      username: SellerFirst.username,
      nationality: SellerFirst.stakeholder_id?.nation || "",
      dob: SellerFirst.stakeholder_id?.date_of_birth || "",
      description: "",
      logo: null,
    });
  }, [SellerFirst]);

  const OnClick = async () => {
    await SellerServices.updateSellerServices(SellerFirst.email, {
      name: formData.firstName + " " + formData.lastName,
      newEmail: formData.email,
      /*password: formData.password,*/
      job: formData.profession,
      nation: formData.nationality,
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file)); // Preview the selected logo
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
    // Handle form submission, including the logo file
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
    });
    setLogoPreview(null); // Reset the logo preview
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Welcome Seller!</h2>
        </Col>
        <Col xs={3} className="text-center">
          {/* Use LogoPlaceholder as the default logo until changed */}
          <img
            src={logoPreview || LogoPlaceholder} // Use logo preview or placeholder
            width="70"
            height="50"
            className="align-top logo"
            alt="Seller logo"
          />
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="Description:"
                type="text"
                placeholder="Change your description"
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
                  <h3>Change Logo</h3>
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

export default SellerFirstProfile;
