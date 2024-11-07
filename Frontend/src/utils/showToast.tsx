import { createRoot } from "react-dom/client";
import React from "react";
import ToastComponent from "../components/ToastComponent";
import { ToastTypes } from "./toastTypes";
import Response from "../../../API/src/types/responses/response";
const showToast = (response: Response) => {
  const { message, status } = response;
  let toastType: ToastTypes = ToastTypes.INFO;

  switch (status) {
    case 200:
      toastType = ToastTypes.SUCCESS; //Great success
      break;
    case 201:
      toastType = ToastTypes.SUCCESS; //Created sucessfully
      break;
    case 400:
      toastType = ToastTypes.WARNING; //Bad request error
      break;
    case 401:
      toastType = ToastTypes.ERROR; //Unauthorized error
      break;
    case 403:
      toastType = ToastTypes.ERROR; //Forbidden action error
      break;
    case 404:
      toastType = ToastTypes.WARNING; //Not found API error
      break;
    case 409:
      toastType = ToastTypes.WARNING; //Conflict error
      break;
    case 500:
      toastType = ToastTypes.ERROR; //Internal Server Error
      break;
    case 501:
      toastType = ToastTypes.INFO; //Not implemented
      break;
    case 503:
      toastType = ToastTypes.WARNING; //Service Unavailable
      break;
    default:
      toastType = ToastTypes.ERROR;
      break;
  }

  const toastRoot = document.createElement("div");
  toastRoot.style.position = "fixed";
  toastRoot.style.bottom = "1rem";
  toastRoot.style.right = "1rem";
  toastRoot.style.zIndex = "9999";
  toastRoot.style.width = "300px";
  document.body.appendChild(toastRoot);

  const root = createRoot(toastRoot);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(toastRoot);
  };

  root.render(
    <ToastComponent message={message} onClose={handleClose} type={toastType} />
  );

  setTimeout(() => {
    handleClose();
  }, 5000);
};

export default showToast;
