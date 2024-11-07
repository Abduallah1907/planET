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
  multiple?: boolean;
  options?: string[];
  min?: string;
  pattern?: string;
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
  multiple,
  options,
  min,
  pattern,
}: InputData) {
  return (
    <Form.Group className="form-group" id={id}>
      <Form.Label>{label}</Form.Label>
      {type === "select" ? (
        <Form.Control
          as="select"
          disabled={disabled}
          required={required}
          onChange={onChange}
          name={name}
          value={value}
          min={min}
          pattern={pattern}
          className={
            disabled
              ? "disabled-input custom-form-control"
              : "custom-form-control"
          }
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options &&
            options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
        </Form.Control>
      ) : (
        <Form.Control
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={onChange}
          name={name}
          className={
            disabled
              ? "disabled-input custom-form-control"
              : "custom-form-control"
          }
          accept={type === "file" ? accept : undefined}
          {...(type !== "file" ? { value: value || "" } : {})}
          multiple={multiple}
        />
      )}
    </Form.Group>
  );
}

export default CustomFormGroup;

{
  /* <Form.Control
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
  multiple={multiple}
/> */
}
