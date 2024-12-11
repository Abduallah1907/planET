import React, { useState } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup";
import { useAppSelector } from "../store/hooks";
import { AdminService } from "../services/AdminService";

interface FormData {
  discount: string;
  numberOfDays: string;
}

interface PromoCodeProps {
  show: boolean;
  onHide: () => void;
}

const PromoCode: React.FC<PromoCodeProps> = ({show, onHide}) => {
  const tourist = useAppSelector((state) => state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    discount: "",
    numberOfDays: "",
  });
  const [promoCode, setPromoCode] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      discount: formData.discount,
      numberOfDays: formData.numberOfDays,
    };
    const response = await AdminService.createPromoCode(data);
    if(response.data.promoCode)
      setPromoCode(response.data.promoCode);
    // onHide(); // Close modal after successful submission
  };

  return (
    <>
      {/* Modal */}
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Promo Code Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {promoCode && (
              <div className="alert alert-success" role="alert">
                Promo Code: {promoCode}
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              {/* Discount Value */}
              <AdminFormGroup
                label="Discount Value"
                type="number"
                placeholder="Enter discount value"
                id="discount"
                name="discount"
                disabled={false}
                required={true}
                value={formData.discount}
                onChange={handleChange}
              />

              {/* Number of Active Days */}
              <AdminFormGroup
                label="Number of Active Days"
                type="number"
                placeholder="Enter number of active days"
                id="numberOfDays"
                name="numberOfDays"
                disabled={false}
                required={true}
                value={formData.numberOfDays}
                onChange={handleChange}
              />

              {/* Submit Button */}
              <div className="form-actions mt-3">
                <Button
                  type="submit"
                  className="button"
                  style={{ backgroundColor: "#d76f30", borderColor: "#d76f30" }}
                >
                  Create
                </Button>
              </div>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PromoCode;
