import React, { useEffect, useState } from "react";
import CustomFormGroup from "../FormGroup/FormGroup";
import "./ProfileFormTourist.css";
import Logo from "../../assets/person-circle.svg";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import nationalityOptionsData from "../../utils/nationalityOptions.json"; // Adjust the path as necessary
import { BiChevronDown } from "react-icons/bi"; // Importing a dropdown icon from react-icons
import { TouristService } from "../../services/TouristService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { FaExchangeAlt, FaInfoCircle } from "react-icons/fa";
import { setStakeholder } from "../../store/userSlice";
import { useAppContext } from "../../AppContext";
import showToast from "../../utils/showToast";
import { ToastTypes } from "../../utils/toastTypes";

interface NationalityOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profession: string;
  password: string;
  retypePassword: string;
  username: string;
  nationality: string;
  dob: string;
}

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profession: "",
    password: "",
    retypePassword: "",
    username: "",
    nationality: "",
    dob: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (formData.password && !formData.retypePassword) ||
      (!formData.password && formData.retypePassword)
    ) {
      alert("Please fill out both password fields.");
      return;
    }

    // If both password fields are filled, validate that they match
    if (formData.password && formData.retypePassword) {
      if (formData.password !== formData.retypePassword) {
        alert("Passwords don't match!");
        return;
      }
    }
  };
  const Tourist = useAppSelector((state: { user: any }) => state.user);

  useEffect(() => {
    setFormData({
      firstName: Tourist.name.split(" ")[0],
      lastName: Tourist.name.split(" ")[1] || "", // Adding a fallback for lastName in case there's no space
      email: Tourist.email,
      mobile: Tourist.phone_number,
      profession: Tourist.stakeholder_id?.job || "", // Optional chaining in case stakeholder_id is undefined
      password: "",
      retypePassword: "",
      username: Tourist.username,
      nationality: Tourist.stakeholder_id?.nation || "", // Optional chaining
      dob: Tourist.stakeholder_id?.date_of_birth || "", // Optional chaining
    });
  }, [Tourist]); // Dependency array to rerun this effect when Tourist data changes
  const OnClick = async () => {
    const Tourist1 = await TouristService.updateTourist(Tourist.email, {
      name: formData.firstName + " " + formData.lastName,
      newEmail: formData.email,
      password: formData.password,
      job: formData.profession,
      nation: formData.nationality,
    });
    if (Tourist1.status === 200) {
      showToast("Updated successfully", ToastTypes.SUCCESS);
    } else {
      showToast("Error in updating", ToastTypes.ERROR);
    }
  };
  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      profession: "",
      password: "",
      retypePassword: "",
      username: "",
      nationality: "",
      dob: "",
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsToTransfer, setPointsToTransfer] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(
    Tourist.stakeholder_id.loyality_points
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const handlePointsChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPointsToTransfer(e.target.value);
  };

  const dispatch = useAppDispatch();

  const transferPointsToWallet = async () => {
    try {
      const user = await TouristService.redeemPoints(
        Tourist.email,
        Number(pointsToTransfer)
      );
      setLoyaltyPoints(
        (prevPoints: number) => prevPoints - Number(pointsToTransfer)
      );
      setPointsToTransfer("");
      closeTransferModal();
      dispatch(setStakeholder(user.data));
    } catch (error) {
      console.error("Error transferring points:", error);
    }
  };

  const { currency } = useAppContext();

  return (
    <div className="profile-form-container">
      <Row className="align-items-center mb-4">
        <Col xs={7} className="text-left">
          <h2 className="my-profile-heading">My Profile</h2>
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
      <Row className="align-items-center">
        <div className="wallet-card">
          <h3>
            Points
            <FaInfoCircle
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={openModal}
            />
          </h3>{" "}
          {/* Add the info icon */}
          <p>{Tourist.stakeholder_id.loyality_points}</p>
        </div>
        <Col xs={3} className="text-center ">
          <FaExchangeAlt
            className="exchange-icon"
            style={{ cursor: "pointer" }}
            onClick={openTransferModal}
          />
        </Col>
        <Modal show={isModalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Points Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Earn Points</h5>
            <p>It's divided into 3 levels</p>
            <p>Level 1: For every 1 EGP spent, you'll earn 0.5 points</p>
            <p>Level 2: For every 1 EGP spent, you'll earn 1 point</p>
            <p>Level 3: For every 1 EGP spent, you'll earn 1.5 points</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="wallet-card">
          <h3>Wallet</h3>
          <p>
            {currency} {Tourist.stakeholder_id.wallet}
          </p>
          <Modal
            show={isTransferModalOpen}
            onHide={closeTransferModal}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Transfer Points</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPoints">
                  <Form.Label>
                    Enter the number of points to transfer
                  </Form.Label>
                  <div>
                    <Form.Text>
                      Every 10,000 points is equal to 100 EGP
                    </Form.Text>
                  </div>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="number"
                      value={pointsToTransfer}
                      onChange={handlePointsChange}
                      placeholder="Enter points"
                      className="mx-2 custom-form-control"
                      step="10000"
                      min="0"
                    />
                  </div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeTransferModal}>
                Close
              </Button>
              <Button variant="main-inverse" onClick={transferPointsToWallet}>
                Transfer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Row>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <CustomFormGroup
                label="First Name:"
                type="text"
                placeholder="Enter your First Name"
                id="firstName"
                name="firstName"
                disabled={false}
                required={false}
                value={formData.firstName}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Last Name:"
                type="text"
                placeholder="Enter your Last Name"
                id="lastName"
                name="lastName"
                disabled={false}
                required={false}
                value={formData.lastName}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomFormGroup
                label="Email:"
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                disabled={false}
                required={true}
                value={formData.email}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Username:"
                type="text"
                placeholder="Enter your username"
                id="username"
                name="username"
                disabled={true}
                required={false}
                value={formData.username}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Mobile Number:"
                type="tel"
                placeholder="Enter your mobile number"
                id="mobile"
                name="mobile"
                disabled={false}
                required={true}
                value={formData.mobile}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Group className="form-group" controlId="nationality">
                <Form.Label>Nationality:</Form.Label>
                <div className="custom-select-container">
                  <Form.Control
                    as="select"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="custom-form-control"
                    required
                  >
                    <option value="">Select your nationality</option>
                    {nationalityOptions.map((option: NationalityOption) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <BiChevronDown className="dropdown-icon" />{" "}
                  {/* Dropdown icon */}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Profession:"
                type="text"
                placeholder="Enter your profession"
                id="profession"
                name="profession"
                disabled={false}
                required={false}
                value={formData.profession}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Date of Birth (MM/DD/YY):"
                type="text"
                placeholder="Enter your date of birth"
                id="dob"
                name="dob"
                disabled={true}
                required={false}
                value={formData.dob}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <CustomFormGroup
                label="Password:"
                type="password"
                placeholder="Enter your password"
                id="password"
                name="password"
                disabled={false}
                required={false}
                value={formData.password}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <CustomFormGroup
                label="Retype Password:"
                type="password"
                placeholder="Retype your password"
                id="retypePassword"
                name="retypePassword"
                disabled={false}
                required={false}
                value={formData.retypePassword}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-center">
            <button className="update-btn" onClick={OnClick}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ProfileForm;
