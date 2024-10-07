import React from "react";
import { Form } from "react-bootstrap";
import "./FormGroup.css";

interface InputData {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  disabled: boolean;
  required: boolean;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className?: string;
  accept?: string;
}

function CustomFormGroup({
  label,
  type,
  placeholder,
  id,
  disabled,
  required,
  value,
  onChange,
  name,
  accept,
}: InputData) {
  return (
    <Form.Group className="form-group" id={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        // value={type !== "file" ? value : ""}
        onChange={onChange}
        name={name}
        className={
          disabled
            ? "disabled-input custom-form-control"
            : " custom-form-control"
        }
        accept={type === "file" ? accept : undefined}
        {...(type !== "file" ? { value: value || "" } : {})}
      />
    </Form.Group>
  );
}

export default CustomFormGroup;
