import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import LogoPlaceholder from "../../assets/person-circle.svg";
import { SellerServices } from "../../services/SellerServices";
import { useAppSelector } from "../../store/hooks";
import { FileService } from "../../services/FileService";

interface FormData {
  description: string;
  logo: File | null;
}

const SellerFirstProfile: React.FC = () => {
  const SellerFirst = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState<FormData>({
    description: "",
    logo: null,
  });

  useEffect(() => {
    setFormData({
      description: SellerFirst.stakeholder_id?.description || "",
      logo: SellerFirst.stakeholder_id?.logo || null,
    });
  }, [SellerFirst]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  const OnClick = async () => {
    if (formData.logo) {
      const file = await FileService.uploadFile(formData.logo);
      await SellerServices.updateSellerServices(SellerFirst.email, {
        description: formData.description,
        logo: file.data._id,
      });
    } else {
      await SellerServices.updateSellerServices(SellerFirst.email, {
        description: formData.description,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      description: "",
      logo: null,
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
            src={LogoPlaceholder}
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
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
          </Row>

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

export default SellerFirstProfile;
