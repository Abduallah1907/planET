import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomFormGroup from "../FormGroup/FormGroup";
import ButtonWide from "../ButtonWide/ButtonWide";
import "./StakeholderForm.css";

interface StakeData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  file: File | null;
  role: string;
}

export default function StakeholderForm() {
  const [StakeData, setStakeData] = useState<StakeData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
    role: "",
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
      console.log("File uploaded: ", e.target.files);
      setStakeData({ ...StakeData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (StakeData.password !== StakeData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Stakeholder Data:", StakeData);
  };

  return (
    <Form className="stake-form form-fields" onSubmit={handleSubmit}>
      <h2>Create account</h2>
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
          <CustomFormGroup
            label={"Upload Documents"}
            type={"file"}
            placeholder={""}
            id={"fileUpload"}
            disabled={false}
            required={true}
            onChange={handleFileChange}
            name={"file"}
            accept={".pdf,.doc,.docx"}
            multiple={true}
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
