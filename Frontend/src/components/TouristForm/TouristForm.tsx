import React from "react";
import InputField from "../InputField/InputField";
import "./TouristForm.css";

export default function TouristForm() {
  return (
    <div className="form-fields">
      <div className="d-flex justify-content-between mb-5">
        <InputField
          labelName="Username"
          inputType="text"
          inputName="name"
          idName="name"
        />
        <InputField
          labelName="Email"
          inputType="email"
          inputName="email"
          idName="email"
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <InputField
          labelName="Password"
          inputType="password"
          inputName="pass"
          idName="pass"
        />
        <InputField
          labelName="Confirm password"
          inputType="password"
          inputName="conPass"
          idName="conPass"
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <InputField
          labelName="Moblie Number"
          inputType="number"
          inputName="mobile"
          idName="mobile"
        />
        <InputField
          labelName="Date of Birth"
          inputType="number"
          inputName="DOB"
          idName="DOB"
        />
      </div>
      <div className="d-flex justify-content-between mb-5">
        <InputField
          labelName="Nationality"
          inputType="text"
          inputName="nation"
          idName="nation"
        />
        <InputField
          labelName="Job"
          inputType="text"
          inputName="job"
          idName="job"
        />
      </div>
    </div>
  );
}
