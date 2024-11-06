import { createRoot } from "react-dom/client"; // Import createRoot for React 18
import React from "react";
import ToastComponent from "../components/ToastComponent"; // Import your ToastComponent
import { ToastTypes } from "./toastTypes";

const showToast = (message: string, type: ToastTypes) => {
  // Create a div element to render the toast
  const toastRoot = document.createElement("div");
  toastRoot.style.position = "fixed";
  toastRoot.style.bottom = "1rem";
  toastRoot.style.right = "1rem";
  toastRoot.style.zIndex = "9999";
  toastRoot.style.width = "300px";
  document.body.appendChild(toastRoot);

  // Create a root for the React component using React 18's createRoot API
  const root = createRoot(toastRoot);

  // Function to handle closing and cleanup
  const handleClose = () => {
    root.unmount(); // Unmount the component when the toast is closed
    document.body.removeChild(toastRoot); // Clean up the DOM node
  };

  // Render the ToastComponent, passing in the message and onClose function
  root.render(
    <ToastComponent message={message} onClose={handleClose} type={type} />
  );

  // Automatically close the toast after 3 seconds
  setTimeout(() => {
    handleClose();
  }, 5000);
};

export default showToast;
