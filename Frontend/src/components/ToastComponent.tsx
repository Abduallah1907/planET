import { Utils } from "../utils/utils";
import { ToastTypes } from "../utils/toastTypes";
import React, { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeToast } from "../store/toastsSlice";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastTypes;
}


const ToastComponent: React.FC = () => {
  const toasts = useAppSelector((state) => state.toasts.toasts);
  const dispatch = useAppDispatch();

  const onClose = (id: string) => {
    // Remove the toast with the given ID
    dispatch(removeToast(id));
  };

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 5000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dispatch]);

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => onClose(toast.id)}
          bg={(() => {
            switch (toast.type) {
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
          })()}
          autohide
          delay={5000}
        >
          <Toast.Header>
            <strong className="me-auto">
              {Utils.capitalizeFirstLetter(toast.type)}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastComponent;