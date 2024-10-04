import React, { useState } from "react";
import InputField from "../InputField/InputField";
import "./TouristForm.css";
import CustomFormGroup from "../FormGroup/FormGroup";
import { Form } from "react-bootstrap";
import { BiChevronDown } from "react-icons/bi";
import nationalityOptionsData from "../../utils/nationalityOptions.json";
import jobOptionsData from "../../utils/jobOptions.json";
import ButtonWide from "../ButtonWide/ButtonWide";

interface NationalityOption {
  value: string;
  label: string;
}

interface JobOption {
  value: string;
  label: string;
}

const nationalityOptions: NationalityOption[] = nationalityOptionsData;
const jobOptions: JobOption[] = jobOptionsData;

interface RegData {
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  nationality: string;
  dob: string;
  job: string;
}

export default function TouristForm() {
  const [regData, setRegData] = useState<RegData>({
    username: "",
    email: "",
    mobile: "",
    job: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    dob: "",
  });

  function validateMobileNumber(mobileNumber: string): boolean {
    const mobileNumberRegex =
      /^\+?\d{1,3}[-\s.]?\(?\d{1,3}\)?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/;
    return mobileNumberRegex.test(mobileNumber);
  }
  // function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const mobileNumber = event.target.value;
  //   if (!validateMobileNumber(mobileNumber)) {
  //     console.error("Invalid mobile number");
  //   } else {
  //     console.log("Valid mobile number");
  //   }
  // }
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRegData({ ...regData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mobileNumber = regData.mobile;
    if (regData.password !== regData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!validateMobileNumber(mobileNumber)) {
      console.error("Invalid mobile number");
      return;
    }
    console.log("Form submitted:", regData);
  };

  return (
    <Form className="form-fields" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between mb-5">
        <CustomFormGroup
          label={"Username"}
          type={"text"}
          placeholder={"username"}
          id={"username"}
          disabled={false}
          required={true}
          value={regData.username}
          onChange={handleChange}
          name={"username"}
        />

        <CustomFormGroup
          label={"Email"}
          type={"email"}
          placeholder={"abcd@gmail.com"}
          id={"email"}
          disabled={false}
          required={true}
          value={regData.email}
          onChange={handleChange}
          name={"email"}
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <CustomFormGroup
          label={"Password"}
          type={"password"}
          placeholder={"password"}
          id={"password"}
          disabled={false}
          required={true}
          value={regData.password}
          onChange={handleChange}
          name={"password"}
        />
        {/* </CustomFormGroup> */}
        {/* <input
          type={"password"}
          placeholder={"**********"}
          minLength={8} // Minimum length of 8 characters
          maxLength={128} // Maximum length of 128 characters
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" // Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character
          title="Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
          autoComplete="off" // Prevent browser from automatically filling in password
        /> */}
        <CustomFormGroup
          label={"Confirm password"}
          type={"password"}
          placeholder={"confirm password"}
          id={"confirmPassword"}
          disabled={false}
          required={true}
          value={regData.confirmPassword}
          onChange={handleChange}
          name={"confirmPassword"}
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <CustomFormGroup
          label={"Mobile Number"}
          type={"string"}
          placeholder={"+20-123456789"}
          id={"mobile"}
          disabled={false}
          required={true}
          value={regData.mobile}
          onChange={handleChange}
          name={"mobile"}
        />
        <CustomFormGroup
          label={"Date of Birth"}
          type={"date"}
          placeholder={"dd/mm/yyyy"}
          id={"dob"}
          disabled={false}
          required={true}
          value={regData.dob}
          onChange={handleChange}
          name={"dob"}
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <Form.Group className="form-group" controlId="nationality">
          <Form.Label>Nationality:</Form.Label>
          <div className="custom-select-container">
            <Form.Control
              as="select"
              name="nationality"
              value={regData.nationality}
              id="nationality"
              onChange={handleChange}
              required
            >
              <option value="">Select your nationality</option>
              {nationalityOptions.map((option: NationalityOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
          </div>
        </Form.Group>
        <Form.Group className="form-group" controlId="job">
          <Form.Label>Job</Form.Label>
          <div className="custom-select-container">
            <Form.Control
              as="select"
              name="job"
              value={regData.job}
              id="job"
              onChange={handleChange}
              required
            >
              <option value="">Select your job</option>
              {jobOptions.map((option: JobOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
          </div>
        </Form.Group>
      </div>
      <div key="default-checkbox" className="mb-3">
        <Form.Check
          type="checkbox"
          // id="default-checkbox"
          label="Remember me"
        />
      </div>
      <div key="default-checkbox" className="mb-4">
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
