import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";

interface WorkExperience {
  id?: string; // Optional ID for existing entries
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
  const [editedWork, setEditedWork] = useState<WorkExperience[]>([]);
  const [deletedWork, setDeletedWork] = useState<WorkExperience[]>([]);

  const TourGuideFirst = useAppSelector((state) => state.user);

  useEffect(() => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [], // Initialize work experience from the state
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

  const handleWorkChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedWork = formData.previousWork.map((work, i) =>
      i === index ? { ...work, [field]: value } : work
    );
    setFormData({ ...formData, previousWork: updatedWork });

    if (updatedWork[index].id) {
      setEditedWork([...editedWork, updatedWork[index]]);
    }
  };

  const handleAddWork = () => {
    const newWork: WorkExperience = { title: "", place: "", from: "", to: "" };
    setFormData({
      ...formData,
      previousWork: [...formData.previousWork, newWork],
    });
    setCreatedWork([...createdWork, newWork]);
  };

  const handleRemoveWork = (index: number) => {
    const workToDelete = formData.previousWork[index];
    if (workToDelete.id) {
      setDeletedWork([...deletedWork, workToDelete]);
    }
    const updatedWork = formData.previousWork.filter((_, i) => i !== index);
    setFormData({ ...formData, previousWork: updatedWork });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await TourGuideServices.updateTourGuide(TourGuideFirst.email, {
      years_of_experience: formData.yearsOfExperience,
      logo: formData.logo,
      createdWork,
      editedWork,
      deletedWork,
    });
  };

  const handleCancel = () => {
    setFormData({
      yearsOfExperience: "",
      previousWork: [],
      logo: null,
    });
    setCreatedWork([]);
    setEditedWork([]);
    setDeletedWork([]);
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
