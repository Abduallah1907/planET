import "./InputField.css";

interface InputFieldProps {
  labelName: string;
  inputType: string;
  inputName: string;
  idName: string;
}

export default function InputField({
  labelName,
  inputType,
  inputName,
  idName,
}: InputFieldProps) {
  return (
    <div id="inputId">
      <label htmlFor={idName}>{labelName} </label>
      <input className="inputField" type={inputType} id={idName} name={inputName} />
    </div>
  );
}
