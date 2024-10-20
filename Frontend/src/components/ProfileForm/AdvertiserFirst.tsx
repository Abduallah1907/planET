import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import LogoPlaceholder from "../../assets/person-circle.svg"; // Placeholder logo
import { useAppSelector } from "../../store/hooks";
import { AdvertiserService } from "../../services/AdvertiserService";

import { FileService } from "../../services/FileService";

interface FormData {
  about: string;
  website: string;
  hotline: string;
  companyProfile: string;
  logo: File | null; // Update logo to handle file
}

const AdvertiserFirst: React.FC = () => {
  const AdvertiserFirst = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState<FormData>({
    about: "",
    website: "",
    hotline: "",
    companyProfile: "",
    logo: null, // Initialize logo
  });

  useEffect(() => {
    setFormData({
      about: AdvertiserFirst.stakeholder_id?.about || "",
      website: AdvertiserFirst.stakeholder_id?.link_to_website || "",
      hotline: AdvertiserFirst.stakeholder_id?.hotline || "",
      companyProfile: AdvertiserFirst.stakeholder_id?.company_profile || "",
      logo: AdvertiserFirst.stakeholder_id?.logo || null,
    });
  }, [AdvertiserFirst]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const OnClick = async () => {
    if (formData.logo) {
      const file = await FileService.uploadFile(formData.logo);
      await AdvertiserService.updateAdvertiser(AdvertiserFirst.email, {
        about: formData.about,
        link_to_website: formData.website,
        hotline: formData.hotline,
        company_profile: formData.companyProfile,
        logo: file.data._id,
      });
    } else {
      await AdvertiserService.updateAdvertiser(AdvertiserFirst.email, {
        about: formData.about,
        link_to_website: formData.website,
        hotline: formData.hotline,
        company_profile: formData.companyProfile,
      });
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

  const handleCancel = () => {
    setFormData({
      about: "",
      website: "",
      hotline: "",
      companyProfile: "",
      logo: null, // Reset logo
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                label="About:"
                type="text"
                placeholder="about...."
                id="about"
                name="about"
                disabled={false}
                required={true}
                value={formData.about}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Link to Website:"
                type="text"
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
                type="text"
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
                type="text"
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

export default AdvertiserFirst;
