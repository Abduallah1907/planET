import { createRoot } from "react-dom/client";
import ToastComponent from "../components/ToastComponent";
import { ToastTypes } from "./toastTypes";
const showToastMessage = (message: string, toastType: ToastTypes) => {
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

export default showToastMessage;
