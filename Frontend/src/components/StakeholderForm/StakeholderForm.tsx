import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomFormGroup from "../FormGroup/FormGroup";
import ButtonWide from "../ButtonWide/ButtonWide";
import "./StakeholderForm.css";
import AuthService from "../../services/authService";
import { FileService } from "../../services/FileService";
import { useNavigate } from "react-router-dom";

interface StakeData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fileL: File[];
  fileObjectIds: string[];
  documents_required?: string[];
  role: string;
  phone_number: string | undefined;
}

export default function StakeholderForm() {
  const [StakeData, setStakeData] = useState<StakeData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fileL: [],
    fileObjectIds: [],
    role: "",
    phone_number: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setStakeData({ ...StakeData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Add selected files to the array
      const selectedFiles = Array.from(e.target.files);
      setStakeData((prevData) => ({
        ...prevData,
        fileL: [...prevData.fileL, ...selectedFiles], // Append new files to the list
      }));
    }
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (StakeData.password !== StakeData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const fileObjectIds = await Promise.all(
      StakeData.fileL.map(async (file) => {
        // Simulate the file upload process and generate objectId for each file
        const response = await FileService.uploadFile(file);
        return response.data._id; // Replace with actual file upload handling
      })
    );
    const updatedStakeData = {
      ...StakeData, // Spread existing StakeData

      name: `${StakeData.firstName} ${StakeData.lastName}`,
      documents_required: fileObjectIds,
    };

    if (StakeData.role == "Seller") {
      try {
        const seller = await AuthService.registerSeller(updatedStakeData);
        navigate("/login"); // Call the API
      } catch (error) {
        console.error("Seller registration failed: ", error);
      }
    } else if (StakeData.role == "Advertiser") {
      try {
        const advertiser = await AuthService.registerAdvertiser(
          updatedStakeData
        ); // Call the API
        navigate("/login");
      } catch (error) {
        console.error("Advertiser registration failed: ", error);
      }
    } else if (StakeData.role == "Tour Guide") {
      try {
        const tourGuide = await AuthService.registerTourGuide(updatedStakeData);
        navigate("/login"); // Call the API
      } catch (error) {
        console.error("Tour Guide registration failed: ", error);
      }
    }
  };

  return (
    <Form className="stake-form form-fields" onSubmit={handleSubmit}>
      <h2>Create account</h2>
      <Row>
        <Col>
          <CustomFormGroup
            label={"First Name"}
            type={"text"}
            placeholder={"first name"}
            id={"firstName"}
            disabled={false}
            required={true}
            value={StakeData.firstName}
            onChange={handleChange}
            name={"firstName"}
          />
        </Col>
        <Col>
          <CustomFormGroup
            label={"Last Name"}
            type={"text"}
            placeholder={"last name"}
            id={"lastName"}
            disabled={false}
            required={true}
            value={StakeData.lastName}
            onChange={handleChange}
            name={"lastName"}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomFormGroup
            label={"Username"}
            type={"text"}
            placeholder={"username"}
            id={"username"}
            disabled={false}
            required={true}
            value={StakeData.username}
            onChange={handleChange}
            name={"username"}
          />
        </Col>
        <Col>
          <CustomFormGroup
            label={"Email"}
            type={"email"}
            placeholder={"abcd@gmail.com"}
            id={"email"}
            disabled={false}
            required={true}
            value={StakeData.email}
            onChange={handleChange}
            name={"email"}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomFormGroup
            label={"Password"}
            type={"password"}
            placeholder={"password"}
            id={"password"}
            disabled={false}
            required={true}
            value={StakeData.password}
            onChange={handleChange}
            name={"password"}
          />
        </Col>
        <Col>
          <CustomFormGroup
            label={"Confirm password"}
            type={"password"}
            placeholder={"confirm password"}
            id={"confirmPassword"}
            disabled={false}
            required={true}
            value={StakeData.confirmPassword}
            onChange={handleChange}
            name={"confirmPassword"}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomFormGroup
            label={"Role Type"}
            type={"select"}
            placeholder={"Select a role"}
            id={"role"}
            disabled={false}
            required={true}
            value={StakeData.role}
            onChange={handleChange}
            name={"role"}
            options={["Tour Guide", "Advertiser", "Seller"]}
          />
        </Col>
        <Col>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              <h3>Upload Files </h3> {/* Added 'Seller Logo' label */}
            </Form.Label>
            <Form.Control
              type="file"
              name="fileL"
              onChange={handleFileChange}
              accept="pdf/*"
              multiple
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomFormGroup
            label={"Mobile Number"}
            type={"string"}
            placeholder={"+20-123456789"}
            id={"phone_number"}
            disabled={false}
            required={true}
            value={StakeData.phone_number}
            onChange={handleChange}
            name={"phone_number"}
          />
        </Col>
      </Row>
      <div key="default-checkbox" className="mb-3">
        <Form.Check
          type="checkbox"
          // id="default-checkbox"
          label="Remember me"
        />
      </div>
      <div key="default-checkbox1" className="mb-4">
        <Form.Check
          type="checkbox"
          // id="default-checkbox"
          label={
            <span>
              I agree to all the{" "}
              <a href="#" className="terms-link">
                Terms
              </a>{" "}
              &{" "}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>
            </span>
          }
        />
      </div>
      <div className="d-flex flex-column text-center">
        <ButtonWide label="Create account" />
        <p className="mt-2">
          Already have an account?
          <a href="#" className="terms-link">
            Login
          </a>
        </p>
      </div>
    </Form>
  );
}
