import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";

interface WorkExperience {
  id?: string;
  title: string;
  place: string;
  from: string;
  to: string;
}

interface FormData {
  yearsOfExperience: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  changePassword: string;
  retypePassword: string;
  username: string;
  logo: string;
  previousWork: WorkExperience[];
}

const ProfileFormGuide: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    changePassword: "",
    retypePassword: "",
    username: "",
    yearsOfExperience: "",
    logo: "",
    previousWork: [],
  });

  const [createdWork, setCreatedWork] = useState<WorkExperience[]>([]);
  const [editedWork, setEditedWork] = useState<WorkExperience[]>([]);
  const [deletedWork, setDeletedWork] = useState<string[]>([]);

  const TourGuide = useAppSelector((state) => state.user);

  useEffect(() => {
    const workExperiences: WorkExperience[] =
      TourGuide.stakeholder_id?.previous_work_description.map((work: any) => ({
        id: work._id,
        title: work.title,
        place: work.place,
        from: work.from ? new Date(work.to).toISOString().split("T")[0] : "",
        to: work.to ? new Date(work.to).toISOString().split("T")[0] : "",
      }));
    setFormData({
      firstName: TourGuide.name.split(" ")[0],
      lastName: TourGuide.name.split(" ")[1] || "", // Fallback for last name
      email: TourGuide.email,
      mobile: TourGuide.phone_number,
      changePassword: "",
      retypePassword: "",
      username: TourGuide.username,
      yearsOfExperience: TourGuide.stakeholder_id?.years_of_experience || "",
      logo: TourGuide.stakeholder_id?.logo || "",
      previousWork: workExperiences || [],
    });
  }, [TourGuide]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (updatedWork[index].id == "") {
      setCreatedWork(
        updatedWork.filter(
          (work) => work.title || work.place || work.from || work.to
        )
      );
    } else {
      setEditedWork(
        updatedWork.filter(
          (work) => work.title || work.place || work.from || work.to
        )
      );
    }
  };
  const handleRemoveWork = (index: number) => {
    const workToDelete = formData.previousWork[index];

    if (workToDelete && workToDelete.id != "") {
      setDeletedWork((prev) => [...prev, workToDelete.id as string]);
      setEditedWork((prev) => prev.filter((_, i) => i !== index));
    }
    const updatedWork = formData.previousWork.filter((_, i) => i !== index);
    setFormData({ ...formData, previousWork: updatedWork });
    setCreatedWork((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.changePassword !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }

    console.log("Created Previous Work: ", createdWork);
    console.log("EDITED: ", editedWork);
    console.log("Deleted Previous Work: ", deletedWork);

    await TourGuideServices.updateTourGuide(TourGuide.email, {
      name: `${formData.firstName} ${formData.lastName}`,
      newEmail: formData.email,
      phone_number: formData.mobile,
      logo: formData.logo,
      years_of_experience: formData.yearsOfExperience,
      password: formData.changePassword,
      //previous_work_description: formData.previousWork,

      createdPreviousWork: createdWork,
      updatedPreviousWork: editedWork,
      deletedPreviousWork: deletedWork,
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      changePassword: "",
      retypePassword: "",
      username: "",
      yearsOfExperience: "",
      logo: "",
      previousWork: [],
    });
    setCreatedWork([]);
    setEditedWork([]);
    setDeletedWork([]);
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Hello Tour Guide</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={Logo}
            width="70"
            height="50"
            className="align-top logo"
            alt="Travel Agency logo"
          />
        </Col>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="First Name"
                type="text"
                placeholder="Enter your First Name"
                id="firstName"
                name="firstName"
                required={true}
                value={formData.firstName}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Last Name"
                type="text"
                placeholder="Enter your Last Name"
                id="lastName"
                name="lastName"
                required={true}
                value={formData.lastName}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomFormGroup
                label="Email"
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                required={true}
                value={formData.email}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Username"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                required={false}
                value={formData.username}
                disabled
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Change Password"
                type="password"
                placeholder="Enter your password"
                id="changePassword"
                name="changePassword"
                required={true}
                value={formData.changePassword}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Retype Password"
                type="password"
                placeholder="Retype your password"
                id="retypePassword"
                name="retypePassword"
                required={true}
                value={formData.retypePassword}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Mobile Number"
                type="tel"
                placeholder="Enter your mobile number"
                id="mobile"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                disabled={false}
              />
            </Col>
          </Row>

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
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={handleAddWork}>Add Work Experience</Button>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="mt-4">
            Update Profile
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 ml-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ProfileFormGuide;
