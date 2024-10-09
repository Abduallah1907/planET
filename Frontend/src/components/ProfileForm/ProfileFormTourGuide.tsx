import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";

interface FormData {
  yearsOfExperience: string; // Ensure this is included
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
}

const ProfileFormGuide: React.FC = () => {
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
    yearsOfExperience: "", // Initialize here
  });
  const TourGuide = useAppSelector((state) => state.user);

  useEffect(() => {
    setFormData({
      firstName: TourGuide.name.split(" ")[0],
      lastName: TourGuide.name.split(" ")[1] || "", // Fallback for last name
      email: TourGuide.email,
      mobile: TourGuide.phone_number,
      profession: TourGuide.stakeholder_id?.job || "",
      password: "",
      retypePassword: "",
      username: TourGuide.username,
      nationality: TourGuide.stakeholder_id?.nation || "",
      dob: TourGuide.stakeholder_id?.date_of_birth || "",
      yearsOfExperience: TourGuide.stakeholder_id?.years_of_experience || "", // Include yearsOfExperience here
    });
  }, [TourGuide]);
  // Dependency array to rerun this effect when Tourist data changes
  const OnClick = async () => {
    await TourGuideServices.updateTourGuide(TourGuide.email, {
      name: formData.firstName + " " + formData.lastName,
      newEmail: formData.email,
      /*password: formData.password,*/
      job: formData.profession,
      nation: formData.nationality,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
    // Here you could also do form submission or API call
    // console.log("Form submitted:", formData);
    // Clear the form after submission if needed
    handleCancel();
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
      yearsOfExperience: "", // Reset here
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Hello Tour Guide</h2>
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
                required={true}
                value={formData.firstName}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Last Name:"
                type="text"
                placeholder="Enter your Last Name"
                id="lastName"
                name="lastName"
                required={true}
                value={formData.lastName}
                onChange={handleChange}
                disabled={false}
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
                required={true}
                value={formData.email}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Username:"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                required={true}
                value={formData.username}
                onChange={handleChange}
                disabled={false} // Assuming this is disabled as per your original code
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
                required={true}
                value={formData.password}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Retype Password:"
                type="password"
                placeholder="Retype your password"
                id="retypePassword"
                name="retypePassword"
                required={true}
                value={formData.retypePassword}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
          </Row>
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

export default ProfileFormGuide;
