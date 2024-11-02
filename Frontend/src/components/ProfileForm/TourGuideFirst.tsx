import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";
import { FileService } from "../../services/FileService";

interface WorkExperience {
  id?: string; // ID from the backend
  title: string;
  place: string;
  from: string;
  to: string;
}

interface FormData {
  yearsOfExperience: string;
  previousWork: WorkExperience[];
  photo: File | null;
}

const TourGuideFirst: React.FC = () => {
  const TourGuideFirst = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState<FormData>({
    yearsOfExperience: "",
    previousWork: [],
    photo: null,
  });

  const [createdWork, setCreatedWork] = useState<WorkExperience[]>([]);
  // Added state for modal visibility
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true); // <-- New handler to show modal
  const handleCloseModal = () => setShowModal(false); // <-- New handler to close modal // <-- New state for modal
  useEffect(() => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [],
      photo: TourGuideFirst.stakeholder_id?.photo || null,
    });
  }, [TourGuideFirst]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photo: e.target.files[0] });
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

  const handleAddWork = () => {
    const newWork: WorkExperience = {
      title: "",
      place: "",
      from: "",
      to: "",
      id: "", // Initialize as empty or undefined
    };
    setFormData((prev) => ({
      ...prev,
      previousWork: [...prev.previousWork, newWork],
    }));

    setCreatedWork((prevCreatedWork) => [...prevCreatedWork, newWork]);
  };

  const handleWorkChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedWork = [...formData.previousWork];

    // Update the specific field
    updatedWork[index] = { ...updatedWork[index], [field]: value };

    setFormData({ ...formData, previousWork: updatedWork });

    // Manage createdWork array
    setCreatedWork(
      updatedWork.filter(
        (work) => work.title || work.place || work.from || work.to
      )
    );
  };

  const handleRemoveWork = (index: number) => {
    const workToDelete = formData.previousWork[index];

    if (workToDelete) {
      // Create a full WorkExperience object for deletedWork
      const workToDeleteEntry: WorkExperience = {
        id: workToDelete.id, // Use the id to track what to delete
        title: workToDelete.title || "",
        place: workToDelete.place || "",
        from: workToDelete.from || "",
        to: workToDelete.to || "",
      };

      // Remove the work entry from the form state
      const updatedWork = formData.previousWork.filter((_, i) => i !== index);
      setFormData({ ...formData, previousWork: updatedWork });

      // Update createdWork by removing only the deleted entry
      setCreatedWork((prevCreatedWork) =>
        prevCreatedWork.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  const OnClick = async () => {
    if (formData.photo) {
      const file = await FileService.uploadFile(formData.photo);
      await TourGuideServices.updateTourGuide(TourGuideFirst.email, {
        years_of_experience: formData.yearsOfExperience,
        createdPreviousWork: createdWork.map((work) => ({
          id: work.id, // Send the ID to the backend
          title: work.title,
          place: work.place,
          from: work.from,
          to: work.to,
        })),

        updatedPreviousWork: [],
        photo: file.data._id,
      });
    } else {
      await TourGuideServices.updateTourGuide(TourGuideFirst.email, {
        years_of_experience: formData.yearsOfExperience,
        photo: formData.photo,
        createdPreviousWork: createdWork.map((work) => ({
          id: work.id, // Send the ID to the backend
          title: work.title,
          place: work.place,
          from: work.from,
          to: work.to,
        })),

        updatedPreviousWork: [],
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [],
      photo: null,
    });
    setCreatedWork([]);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <CustomFormGroup
              label="Years of Experience"
              type="number"
              placeholder="Enter your years of experience"
              id="yearsOfExperience"
              name="yearsOfExperience"
              required
              value={formData.yearsOfExperience}
              onChange={handleChange}
              disabled={false}
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
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Work Experience Table */}
        <Row>
          <Col>
            <h3>Previous Work Experience</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Place</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.previousWork.map((work, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={work.title}
                        onChange={(e) =>
                          handleWorkChange(index, "title", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={work.place}
                        onChange={(e) =>
                          handleWorkChange(index, "place", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        value={work.from}
                        onChange={(e) =>
                          handleWorkChange(index, "from", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        value={work.to}
                        onChange={(e) =>
                          handleWorkChange(index, "to", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveWork(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={handleAddWork} variant="success">
              + Add Work Experience
            </Button>
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

        <div className="form-actions">
          <Button type="submit" className="update-btn" onClick={OnClick}>
            Update
          </Button>
          <Button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
      {/* Terms and Conditions Modal */}
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
          <p>For more detailed information, please contact our support team.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TourGuideFirst;
//deleted is empty
