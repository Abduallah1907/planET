import React, { useState } from "react";
import "../CreateAdmin/CreateAdmin.css";
import AdminFormGroup from "../../components/FormGroup/FormGroup";
import { Container, Button, Form, Modal } from "react-bootstrap"; // Import Modal
import { TouristService } from "../../services/TouristService";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface FormData {
  title: string;
  problem: string;
  date: string;
}

const ComplaintForm: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const tourist = useAppSelector((state) => state.user.stakeholder_id);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    problem: "",
    date: "",
  });
  const [showModal, setShowModal] = useState(false); // Modal state

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
      body: formData.problem,
      date: formData.date,
    };
    await TouristService.fileComplaint(tourist._id, data);
    setShowModal(true); // Show the modal after successful submission
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      problem: "",
      date: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleCancel();
    showToast("file complaint submitted scussefully", ToastTypes.SUCCESS);
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
            label="Date"
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

      {/* Modal for success message */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your complaint has been submitted successfully!</Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="button"
            variant="main-inverse"
            style={{ backgroundColor: "#d76f30", borderColor: "#d76f30" }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComplaintForm;
