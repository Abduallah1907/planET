import React, { useEffect, useState } from "react";
import "./ProfileFormTourist.css"; // Ensure it includes your CSS for layout

import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Sidebar from "../SideBar/Sidebar";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { toggleSidebar } from "../../store/sidebarSlice";
import { TourGuideServices } from "../../services/TourGuideServices";

interface WorkExperience {
  title: string;
  place: string;
  from: string; // Assuming date is captured as string (ISO format)
  to: string;
}

interface FormData {
  mobile: string;
  yearsOfExperience: string;
  previousWork: WorkExperience[];
  password: string;
  retypePassword: string;
  nationality: string;
  dob: string;
}

const TourGuideFirst: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    mobile: "",
    yearsOfExperience: "",
    previousWork: [
      { title: "", place: "", from: "", to: "" }, // Initial empty work experience
    ],
    password: "",
    retypePassword: "",
    nationality: "",
    dob: "",
  });
  const TourGuideFirst = useAppSelector((state) => state.user);

  useEffect(() => {
    setFormData({
      mobile: TourGuideFirst.phone_number || "", // Update mobile
      yearsOfExperience: "", // Reset yearsOfExperience
      previousWork: [{ title: "", place: "", from: "", to: "" }], // Reset previous work experience
      password: "", // Reset password
      retypePassword: "", // Reset retypePassword
      nationality: "", // Reset nationality
      dob: "", // Reset date of birth
    });
  }, [TourGuideFirst]);

  const OnClick = async () => {
    await TourGuideServices.updateTourGuide(TourGuideFirst.email, {
      /*password: formData.password,*/
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  };

  const handleAddWork = () => {
    setFormData({
      ...formData,
      previousWork: [
        ...formData.previousWork,
        { title: "", place: "", from: "", to: "" },
      ],
    });
  };

  const handleRemoveWork = (index: number) => {
    const updatedWork = formData.previousWork.filter((_, i) => i !== index);
    setFormData({ ...formData, previousWork: updatedWork });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords don't match!");
      return;
    }
    // console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      mobile: "",
      yearsOfExperience: "",
      previousWork: [{ title: "", place: "", from: "", to: "" }], // Reset work experience
      password: "",
      retypePassword: "",
      nationality: "",
      dob: "",
    });
  };

  const isSidebarOpen = useAppSelector((state) => state.sidebar.isOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="profile-form-container">
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          navItems={[
            { path: "/dashboard", label: "Dashboard" },
            { path: "/TourGuide", label: "Profile" },
            { path: "/jobs", label: "Jobs" },
            { path: "/settings", label: "Settings" },
          ]}
        />
      </div>
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <Row className="align-items-center mb-4">
          <Col xs={9} className="text-left">
            <h2 className="my-profile-heading">Hi Tour Guide</h2>
          </Col>
          <Col xs={1} className="text-center">
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

            {/* Dynamic Previous Work Section */}
            <Row>
              <Col>
                <h3>Previous Work Experience</h3>
                {formData.previousWork.map((work, index) => (
                  <div key={index} className="work-experience-entry">
                    <CustomFormGroup
                      label="Job Title"
                      type="text"
                      placeholder="Enter your job title"
                      id={`title-${index}`}
                      name={`title-${index}`}
                      required
                      value={work.title}
                      onChange={(e) =>
                        handleWorkChange(index, "title", e.target.value)
                      }
                      disabled={false}
                    />
                    <CustomFormGroup
                      label="Place"
                      type="text"
                      placeholder="Enter place of work"
                      id={`place-${index}`}
                      name={`place-${index}`}
                      required
                      value={work.place}
                      onChange={(e) =>
                        handleWorkChange(index, "place", e.target.value)
                      }
                      disabled={false}
                    />
                    <CustomFormGroup
                      label="From"
                      type="date"
                      id={`from-${index}`}
                      name={`from-${index}`}
                      required
                      value={work.from}
                      onChange={(e) =>
                        handleWorkChange(index, "from", e.target.value)
                      }
                      disabled={false}
                      placeholder={""}
                    />
                    <CustomFormGroup
                      label="To"
                      type="date"
                      id={`to-${index}`}
                      name={`to-${index}`}
                      required
                      value={work.to}
                      onChange={(e) =>
                        handleWorkChange(index, "to", e.target.value)
                      }
                      disabled={false}
                      placeholder={""}
                    />
                    <Button
                      variant="danger"
                      className="remove-work-btn"
                      onClick={() => handleRemoveWork(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="success"
                  className="add-work-btn"
                  onClick={handleAddWork}
                >
                  + Add Work Experience
                </Button>
              </Col>
            </Row>

            <div className="form-actions">
              <Button type="submit" className="update-btn">
                Update
              </Button>
              <Button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default TourGuideFirst;
