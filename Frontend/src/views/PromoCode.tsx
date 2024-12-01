import React, { useState } from "react";
import "../views/CreateAdmin/CreateAdmin.css";
import { Container, Button, Form } from "react-bootstrap";
import AdminFormGroup from "../components/FormGroup/FormGroup";
import { useAppSelector } from "../store/hooks";
import { BiChevronDown } from "react-icons/bi";
import { AdminService } from "../services/AdminService";

interface FormData {
  discount: string;
  numberOfDays: string;
}

const PromoCode: React.FC = () => {
  const tourist = useAppSelector((state) => state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    discount: "",
    numberOfDays: "",
  });

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
    await AdminService.createPromoCode(data);
  };

  return (
    <div className="profile-form-container">
      <div className="text-left mb-4">
        <h2 className="my-profile-heading">PromoCode Form</h2>
      </div>
      <Container>
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

          {/* Date */}
          <AdminFormGroup
            label="Number of Active days"
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
              variant="main-inverse"
              style={{ backgroundColor: "#d76f30", borderColor: "#d76f30" }}
            >
              Create
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default PromoCode;
