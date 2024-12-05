import React, { useState } from "react";
import "../CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../../components/FormGroup/FormGroup";
import { Container, Button, Form, Modal } from "react-bootstrap"; // Import Modal
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";

interface FormData {
  title: string;
  problem: string;
  date: string;
}

interface ComplaintFormProps {
  show: boolean;
  onHide: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ show, onHide }) => {
  const tourist = useAppSelector((state) => state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    problem: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      body: formData.problem,
      date: formData.date,
    };
    await TouristService.fileComplaint(tourist._id, data);
    onHide(); // Close the modal after submission
  };

  return (
    <>
      {/* Modal for filing a complaint */}
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                type="textarea"
                placeholder="Describe your problem in detail"
                id="problem"
                name="problem"
                disabled={false}
                required={true}
                value={formData.problem}
                onChange={handleChange}
              />

              <AdminFormGroup
                label="Date of problem"
                type="date"
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
                  variant="main-inverse"
                  style={{ backgroundColor: "#d76f30", borderColor: "#d76f30" }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ComplaintForm;
