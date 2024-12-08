import { ToastTypes } from "./toastTypes";
import Response from "../../../API/src/types/responses/response";
import { addToast } from "../store/toastsSlice";
import { getToastDispatcher } from "./useToastDispatcher";

const showToast = (response: Response) => {
  const { message, status } = response;
  let toastType: ToastTypes = ToastTypes.INFO;

  if (!message || message === "") {
    return;
  }

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

  const dispatch = getToastDispatcher();

  dispatch(addToast({ id: Date.now().toString(), message, type: toastType }));
};

export default showToast;
