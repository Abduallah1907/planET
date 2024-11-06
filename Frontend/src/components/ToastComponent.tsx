import { Utils } from "../utils/utils";
import { ToastTypes } from "../utils/toastTypes";
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap"; // Assuming you're using React-Bootstrap

interface ToastComponentProps {
  message: string;
  type: ToastTypes;
  onClose: () => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  message,
  type,
  onClose,
}) => {
  const bg = (() => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "primary";
    }
  })();
  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast onClose={onClose} show={!!message} bg={bg}>
        <Toast.Header>
          <strong className="me-auto">
            {Utils.capitalizeFirstLetter(type)}
          </strong>
        </Toast.Header>
        <Toast.Body className={"text-white"}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
