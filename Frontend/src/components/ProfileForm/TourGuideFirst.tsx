import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";

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
  logo: File | null;
}

const TourGuideFirst: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    yearsOfExperience: "",
    previousWork: [],
    logo: null,
  });

  const [createdWork, setCreatedWork] = useState<WorkExperience[]>([]);

  const TourGuideFirst = useAppSelector((state) => state.user);

  useEffect(() => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [],
      logo: null,
    });
  }, [TourGuideFirst]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "logo") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setFormData({ ...formData, logo: fileInput.files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

    await TourGuideServices.updateTourGuide(TourGuideFirst.email, {
      years_of_experience: formData.yearsOfExperience,
      photo: formData.logo,
      createdPreviousWork: createdWork.map((work) => ({
        id: work.id, // Send the ID to the backend
        title: work.title,
        place: work.place,
        from: work.from,
        to: work.to,
      })),

      updatedPreviousWork: [], // Ensure updatedPreviousWork is empty
    });
  };

  const handleCancel = () => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [],
      logo: null,
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

        <div className="form-actions">
          <Button type="submit" className="update-btn">
            Update
          </Button>
          <Button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TourGuideFirst;
//deleted is empty
