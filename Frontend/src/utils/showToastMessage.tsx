import { ToastTypes } from "./toastTypes";
import { addToast } from "../store/toastsSlice";
import { getToastDispatcher } from "./useToastDispatcher";

const showToastMessage = (message: string, toastType: ToastTypes) => {
  const dispatch = getToastDispatcher();

  dispatch(addToast({ id: Date.now().toString(), message, type: toastType }));
};

export default showToastMessage;
