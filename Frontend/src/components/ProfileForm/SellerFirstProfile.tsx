import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./Advertiser.css";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true); // <-- New handler to show modal
  const handleCloseModal = () => setShowModal(false);
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
      const seller = await SellerServices.updateSellerServices(
        SellerFirst.email,
        {
          description: formData.description,
          logo: file.data._id,
        }
      );
    } else {
      const seller2 = await SellerServices.updateSellerServices(
        SellerFirst.email,
        {
          description: formData.description,
        }
      );
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
          {/* Terms and Conditions Checkbox */}
          <div key="default-checkbox1" className="mb-4">
            <Form.Check
              type="checkbox"
              label={
                <span>
                  I agree to all the{" "}
                  <a href="#" onClick={handleShowModal} className="terms-link">
                    {" "}
                    {/* <-- Updated to open modal */}
                    Terms & Conditions
                  </a>{" "}
                </span>
              }
              required
            />
          </div>

          <div className="d-flex justify-content-center">
            <button className="update-btn" onClick={OnClick}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Form>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Terms & Conditions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Terms & Conditions</h5>
            <p>
              By using this service, you agree to the following terms and
              conditions:
            </p>
            <ul>
              <li>You must be at least 18 years old to use this service.</li>
              <li>
                All information provided by you must be accurate and complete.
              </li>
              <li>
                We reserve the right to modify or terminate the service for any
                reason.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account.
              </li>
              <li>
                Any violation of these terms may result in termination of your
                account.
              </li>
            </ul>
            <p>
              For more detailed information, please contact our support team.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default SellerFirstProfile;
