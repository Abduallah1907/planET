import React, { useState } from "react";
import "../CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../../components/FormGroup/FormGroup";
import { Container, Button, Form } from "react-bootstrap";
import { TouristService } from "../../services/TouristService";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface FormData {
  title: string;
  problem: string;
  date: string;
}

const ComplaintForm: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist=useAppSelector((state)=>state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    title: "",
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
      problem: formData.problem,
      date: formData.date,
    };
    await TouristService.fileComplaint(tourist._id,data);
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      problem: "",
      date: "",
    });
  };

  return (
    <div className="profile-form-container">
      <div className="text-left mb-4">
        <h2 className="my-profile-heading">Complaint Form</h2>
      </div>

      <Container>
        <Form onSubmit={handleSubmit}>
          <AdminFormGroup
            label="Title"
            type="text"
            placeholder="Enter title"
            id="title"
            name="title"
            disabled={false}
            required={true}
            value={formData.title}
            onChange={handleChange}
          />

          <AdminFormGroup
            label="Problem"
            type="textarea" // Correct way to use textarea
            placeholder="Describe your problem in detail"
            id="problem"
            name="problem"
            disabled={false}
            required={true}
            value={formData.problem}
            onChange={handleChange}
          />

          {/* Date field with date picker */}
          <AdminFormGroup
            label="Date"
            type="date" // Use date type to allow easy date picking
            placeholder="Select the date the problem occurred"
            id="date"
            name="date"
            disabled={false}
            required={true}
            value={formData.date}
            onChange={handleChange}
          />

          <div className="form-actions mt-3">
            <Button
              type="submit"
              className="button"
              style={{ backgroundColor: "#d76f30", borderColor: "#d76f30" }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ComplaintForm;
