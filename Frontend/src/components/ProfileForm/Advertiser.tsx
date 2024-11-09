import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./Advertiser.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { AdvertiserService } from "../../services/AdvertiserService";
import { useAppSelector } from "../../store/hooks";
import { FileService } from "../../services/FileService";
import { isValidObjectId } from "../../utils/CheckObjectId";
import { ToastTypes } from "../../utils/toastTypes";
import showToastMessage from "../../utils/showToastMessage";
import { Utils } from "../../utils/utils";
import { useDispatchContext } from "../../dispatchContenxt";
import { setUser } from "../../store/userSlice";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  changePassword: string;
  retypePassword: string;
  username: string;
  logo: File | null;
  about: string;
  companyProfile: string;
  hotline: string;
  linktoweb: string;
}

const Advertiser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    changePassword: "",
    retypePassword: "",
    username: "",
    logo: null, // Initialize logo as null
    about: "",
    companyProfile: "",
    hotline: "",
    linktoweb: "",
  });
  const [fileUrl, setFileUrl] = useState("");
  const Advertiser = useAppSelector((state) => state.user);
  const getAdvertiserData = async () => {
    if (
      Advertiser.stakeholder_id.logo &&
      isValidObjectId(Advertiser.stakeholder_id.logo)
    ) {
      const file = await FileService.downloadFile(
        Advertiser.stakeholder_id.logo
      );

      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFormData({
        firstName: Advertiser.name?.split(" ")[0] || "",
        lastName: Advertiser.name?.split(" ")[1] || "",
        email: Advertiser.email || "",
        mobile: Advertiser.phone_number || "",
        changePassword: "",
        retypePassword: "",
        username: Advertiser.username || "",
        logo: file.data || null,
        about: Advertiser.stakeholder_id?.about || formData.about || "",
        hotline: Advertiser.stakeholder_id?.hotline || "",
        linktoweb: Advertiser.stakeholder_id?.link_to_website || "",
        companyProfile: Advertiser.stakeholder_id?.company_profile || "",
      });
    } else {
      setFormData({
        firstName: Advertiser.name?.split(" ")[0] || "",
        lastName: Advertiser.name?.split(" ")[1] || "",
        email: Advertiser.email || "",
        mobile: Advertiser.phone_number || "",
        changePassword: "",
        retypePassword: "",
        username: Advertiser.username || "",
        logo: null,
        about: Advertiser.stakeholder_id?.about || formData.about || "",
        hotline: Advertiser.stakeholder_id?.hotline || "",
        linktoweb: Advertiser.stakeholder_id?.link_to_website || "",
        companyProfile: Advertiser.stakeholder_id?.company_profile || "",
      });
    }
  };

  useEffect(() => {
    getAdvertiserData();
  }, [Advertiser]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Restrict the mobile field to numbers only
    if (name === "mobile") {
      // Use a regular expression to allow only numbers
      if (/[^0-9]/.test(value)) {
        return; // Prevent updating the state if non-numeric characters are entered
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const dispatch = useDispatchContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Password validation
    if (
      (formData.changePassword && !formData.retypePassword) ||
      (!formData.changePassword && formData.retypePassword)
    ) {
      showToastMessage("Please fill out both password fields.", ToastTypes.ERROR);
      return;
    }
    // Phone number validation for length
    if (formData.mobile.length !== 11) {
      showToastMessage("Mobile number must be exactly 11 digits.", ToastTypes.ERROR);
      return;
    }

    if (
      formData.changePassword &&
      formData.changePassword !== formData.retypePassword
    ) {
      showToastMessage("Passwords do not match", ToastTypes.ERROR);
      return;
    }

    // Construct the initial update data
    const updateData: any = {
      name: `${formData.firstName} ${formData.lastName}`,
      newEmail: formData.email,
      phone_number: formData.mobile,
      about: formData.about,
      hotline: formData.hotline,
      company_profile: formData.companyProfile,
      link_to_website: formData.linktoweb,
    };

    // Add password if it passed validation
    if (formData.changePassword) {
      updateData.password = formData.changePassword;
    }

    // Handle logo upload if logo exists
    if (formData.logo) {
      const file = await FileService.uploadFile(formData.logo);
      updateData.logo = file.data._id;
    }

    // Send the update request with the constructed updateData object
    const Adv = await AdvertiserService.updateAdvertiser(
      Advertiser.email,
      updateData
    );

    // Show success or error toast based on response
    if (Adv.status === 200) {
      const updateAdvertiser = {
        ...Advertiser,
        name: updateData.name,
        email: updateData.newEmail,
        phone_number: updateData.phone_number,
        stakeholder_id: {
          ...Advertiser.stakeholder_id,
          about: updateData.about,
          hotline: updateData.hotline,
          company_profile: updateData.company_profile,
          link_to_website: updateData.link_to_website,
        },
      }
      dispatch(setUser(updateAdvertiser));
    } else {
      showToastMessage("Error in updating", ToastTypes.ERROR);
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.usernameOrEmail && user.password) {
      const password = Utils.decryptPassword(user.password)
      if (password !== updateData.password && formData.changePassword) {
        localStorage.setItem("user", JSON.stringify({ usernameOrEmail: user.usernameOrEmail, password: Utils.encryptPassword(updateData.password) }));
      }
    }

  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      companyProfile: "",
      changePassword: "",
      retypePassword: "",
      username: "",
      logo: null, // Reset logo
      about: "",
      linktoweb: "",
      hotline: "",
    });
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4 w-100">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Hi Advertiser!</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={fileUrl !== "" ? fileUrl : Logo}
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
                type="text"
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
                label="change Password:"
                type="password"
                placeholder="Enter your password"
                id="changePassword"
                name="changePassword"
                disabled={false}
                required={false}
                value={formData.changePassword}
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
                label="About:"
                type="text"
                placeholder="about"
                id="about"
                name="about"
                disabled={false}
                required={true}
                value={formData.about} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Mobile Number:"
                type="tel"
                placeholder="Enter your mobile number"
                id="mobile"
                name="mobile"
                disabled={false}
                required={true}
                value={formData.mobile}
                onChange={handleChange}
                pattern="^[0-9]{11}$" // Only 11 digits
              // Ensures exactly 11 digits
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomFormGroup
                label="hotline:"
                type="text"
                placeholder="Enter your hotline"
                id="hotline"
                name="hotline"
                disabled={false}
                required={true}
                value={formData.hotline} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="company profile "
                type="text"
                placeholder="Enter your companyProfile"
                id="companyProfile"
                name="companyProfile"
                disabled={false}
                required={true}
                value={formData.companyProfile} // Correctly referencing description
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomFormGroup
                label="Link to Website "
                type="text"
                placeholder="Enter your website link"
                id="linktoweb"
                name="linktoweb"
                disabled={false}
                required={true}
                value={formData.linktoweb} // Correctly referencing description
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
                  className="custom-form-control"
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* New row for 'About' section */}

          <div className="d-flex justify-content-center">
            <Button type="submit" variant="main-inverse" className="px-5 py-2">
              Confirm
            </Button>
            <Button variant="main-border" className="px-5 py-2" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Advertiser;
