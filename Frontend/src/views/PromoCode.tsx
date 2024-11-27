import React, { useState } from "react";
import "../views/CreateAdmin/CreateAdmin.css";
import { Container, Button, Form } from "react-bootstrap"; 
import AdminFormGroup from "../components/FormGroup/FormGroup"; 
import { useAppSelector } from "../store/hooks";
import { BiChevronDown } from "react-icons/bi";

interface FormData {
  title: string;
  promoCode: string;
  discountType: "percentage" | "cash";
  discountValue: string;
  problem: string;
  date: string;
}

const PromoCode: React.FC = () => {
  const tourist = useAppSelector((state) => state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    promoCode: "",
    discountType: "percentage",
    discountValue: "",
    problem: "",
    date: "",
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
      title: formData.title,
      promoCode: formData.promoCode,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      body: formData.problem,
      date: formData.date,
    };
    console.log(data); // Replace this with an actual API call
  };

  return (
    <div className="profile-form-container">
      <div className="text-left mb-4">
        <h2 className="my-profile-heading">PromoCode Form</h2>
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          {/* Promo Code */}
          <AdminFormGroup
            label="Promo Code"
            type="text"
            placeholder="Enter promo code"
            id="promoCode"
            name="promoCode"
            disabled={false}
            required={true}
            value={formData.promoCode}
            onChange={handleChange}
          />

          {/* Discount Type */}
          <Form.Group className="form-group" controlId="discountType">
            <Form.Label>Discount Type</Form.Label>
            <div className="custom-select-container">
              <Form.Control
                as="select"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="custom-form-control"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="cash">Cash</option>
              </Form.Control>
              <BiChevronDown className="dropdown-icon" />
            </div>
          </Form.Group>

          {/* Discount Value */}
          <AdminFormGroup
            label="Discount Value"
            type="number"
            placeholder="Enter discount value"
            id="discountValue"
            name="discountValue"
            disabled={false}
            required={true}
            value={formData.discountValue}
            onChange={handleChange}
          />

          {/* Date */}
          <AdminFormGroup
            label="Expiry Date"
            type="date"
            placeholder="Select the date the problem occurred"
            id="date"
            name="date"
            disabled={false}
            required={true}
            value={formData.date}
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
