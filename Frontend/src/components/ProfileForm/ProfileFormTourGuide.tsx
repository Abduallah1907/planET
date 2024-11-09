import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./Advertiser.css";
import Logo from "../../assets/person-circle.svg";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { TourGuideServices } from "../../services/TourGuideServices";
import { isValidObjectId } from "../../utils/CheckObjectId";
import { FileService } from "../../services/FileService";
import { ToastTypes } from "../../utils/toastTypes";
import { FaTrashAlt } from "react-icons/fa";
import showToastMessage from "../../utils/showToastMessage";
import { Utils } from "../../utils/utils";
import { useDispatchContext } from "../../dispatchContenxt";
import { setUser } from "../../store/userSlice";

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
  logo: File | null;
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
    logo: null,
    previousWork: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workToDeleteIndex, setWorkToDeleteIndex] = useState<number | null>(
    null
  );

  const [fileUrl, setFileUrl] = useState("");
  const [createdWork, setCreatedWork] = useState<WorkExperience[]>([]);
  const [editedWork, setEditedWork] = useState<WorkExperience[]>([]);
  const [deletedWork, setDeletedWork] = useState<string[]>([]);

  const TourGuide = useAppSelector((state) => state.user);
  const getTourGuideData = async () => {
    if (
      TourGuide.stakeholder_id?.logo &&
      isValidObjectId(TourGuide.stakeholder_id.logo)
    ) {
      const file = await FileService.downloadFile(
        TourGuide.stakeholder_id.logo
      );

      const url = URL.createObjectURL(file);
      setFileUrl(url);
      const workExperiences: WorkExperience[] =
        TourGuide.stakeholder_id?.previous_work_description.map(
          (work: any) => ({
            id: work._id,
            title: work.title,
            place: work.place,
            from: work.from
              ? new Date(work.to).toISOString().split("T")[0]
              : "",
            to: work.to ? new Date(work.to).toISOString().split("T")[0] : "",
          })
        );
      setFormData({
        firstName: TourGuide.name.split(" ")[0],
        lastName: TourGuide.name.split(" ")[1] || "", // Fallback for last name
        email: TourGuide.email,
        mobile: TourGuide.phone_number,
        changePassword: "",
        retypePassword: "",
        username: TourGuide.username,
        yearsOfExperience: TourGuide.stakeholder_id?.years_of_experience || "",
        logo: file.data || null,
        previousWork: workExperiences || [],
      });
    } else {
      const workExperiences: WorkExperience[] =
        TourGuide.stakeholder_id?.previous_work_description.map(
          (work: any) => ({
            id: work._id,
            title: work.title,
            place: work.place,
            from: work.from
              ? new Date(work.to).toISOString().split("T")[0]
              : "",
            to: work.to ? new Date(work.to).toISOString().split("T")[0] : "",
          })
        );
      setFormData({
        firstName: TourGuide.name.split(" ")[0],
        lastName: TourGuide.name.split(" ")[1] || "", // Fallback for last name
        email: TourGuide.email,
        mobile: TourGuide.phone_number,
        changePassword: "",
        retypePassword: "",
        username: TourGuide.username,
        yearsOfExperience: TourGuide.stakeholder_id?.years_of_experience || "",
        logo: null,
        previousWork: workExperiences || [],
      });
    }
  };

  useEffect(() => {
    getTourGuideData();
  }, [TourGuide]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "yearsOfExperience") {
      const numericalValue = parseInt(value);
      if (numericalValue < 0) {
        showToastMessage(
          "Years of Experience cannot be negative",
          ToastTypes.ERROR
        );
        setFormData({ ...formData, [name]: "0" });
        return;
      }
    }
    if (name === "mobile") {
      // Use a regular expression to allow only numbers
      if (/[^0-9]/.test(value)) {
        return; // Prevent updating the state if non-numeric characters are entered
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, logo: e.target.files[0] });
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

    if (updatedWork[index].id === "") {
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

    if (workToDelete && workToDelete.id !== "") {
      setDeletedWork((prev) => [...prev, workToDelete.id as string]);
      setEditedWork((prev) => prev.filter((_, i) => i !== index));
    }
    const updatedWork = formData.previousWork.filter((_, i) => i !== index);
    setFormData({ ...formData, previousWork: updatedWork });
    setCreatedWork((prev) => prev.filter((_, i) => i !== index));
  };

  const dispatch = useDispatchContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (formData.changePassword && !formData.retypePassword) ||
      (!formData.changePassword && formData.retypePassword)
    ) {
      showToastMessage(
        "Please fill out both password fields.",
        ToastTypes.ERROR
      );
      return;
    }
    if (formData.mobile.length !== 11) {
      showToastMessage(
        "Mobile number must be exactly 11 digits.",
        ToastTypes.ERROR
      );
      return;
    }

    if (
      formData.changePassword &&
      formData.changePassword !== formData.retypePassword
    ) {
      showToastMessage("Passwords do not match", ToastTypes.ERROR);
      return;
    }

    // Create the update data object without the password field initially
    const updateData: any = {
      name: `${formData.firstName} ${formData.lastName}`,
      newEmail: formData.email,
      phone_number: formData.mobile,
      years_of_experience: formData.yearsOfExperience,
      createdPreviousWork: createdWork,
      updatedPreviousWork: editedWork,
      deletedPreviousWork: deletedWork,
    };

    // Add password if it has been validated
    if (formData.changePassword) {
      updateData.password = formData.changePassword;
    }

    // If a logo file is present, upload it and add the logo ID to the update data
    if (formData.logo) {
      const file = await FileService.uploadFile(formData.logo);

      updateData.logo = file.data._id;
    }

    // Send the update request with the constructed updateData object
    const TourG = await TourGuideServices.updateTourGuide(
      TourGuide.email,
      updateData
    );

    // Show success or error toast based on response
    if (TourG.status === 200) {
      // Create a new object with the updated properties
      const updatedTourGuide = {
        ...TourGuide,
        name: updateData.name,
        email: updateData.newEmail,
        phone_number: updateData.phone_number,
        stakeholder_id: {
          ...TourGuide.stakeholder_id,
          years_of_experience: updateData.years_of_experience,
          logo: updateData.logo,
          previous_work_description: [
            ...createdWork,
            ...editedWork,
          ],
        },
      };
      dispatch(setUser(updatedTourGuide));
    } else {
      showToastMessage("Error in updating", ToastTypes.ERROR);
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.usernameOrEmail && user.password) {
      const password = Utils.decryptPassword(user.password)
      if (password !== updateData.password && formData.changePassword) {
        localStorage.setItem("user", JSON.stringify({usernameOrEmail: user.usernameOrEmail, password: Utils.encryptPassword(updateData.password)}));
      }
    }
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
      logo: null,
      previousWork: [],
    });
    setCreatedWork([]);
    setEditedWork([]);
    setDeletedWork([]);
  };
  const handleDeleteWork = (index: number) => {
    setWorkToDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteWork = () => {
    if (workToDeleteIndex !== null) {
      handleRemoveWork(workToDeleteIndex); // Call your existing remove function
    }
    setShowDeleteModal(false);
    setWorkToDeleteIndex(null);
  };

  const cancelDeleteWork = () => {
    setShowDeleteModal(false);
    setWorkToDeleteIndex(null);
  };

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4 w-100">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">Hello Tour Guide</h2>
        </Col>
        <Col xs={3} className="text-center">
          <img
            src={fileUrl != "" ? fileUrl : Logo}
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
                required={false}
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
                required={false}
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
                pattern="^[0-9]{11}$"
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
          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <h3>Upload Logo</h3> {/* Added 'Seller Logo' label */}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="custom-form-control"
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
                        <Button variant="main-inverse" className="mt-2">
                          <FaTrashAlt onClick={() => handleDeleteWork(index)}>
                            Delete
                          </FaTrashAlt>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="main-inverse" onClick={handleAddWork}>
                Add Work Experience
              </Button>
            </Col>
          </Row>

          <div className="d-flex justify-content-center">
            <Button type="submit" className="px-5 py-2"  variant="main-inverse">
              Confirm
            </Button>
            <Button variant="main-border" className="px-5 py-2"  onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
        <Modal show={showDeleteModal} onHide={cancelDeleteWork} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this work experience?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="main"
              className="border-warning-subtle"
              onClick={cancelDeleteWork}
            >
              Cancel
            </Button>
            <Button variant="main-inverse" onClick={confirmDeleteWork}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ProfileFormGuide;
