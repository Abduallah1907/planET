import { useDispatchContext } from "../dispatchContenxt";

let toastDispatcher: any;

export const useToastDispatcher = () => {
  toastDispatcher = useDispatchContext();
};

export const getToastDispatcher = () => {
  if (!toastDispatcher) {
    throw new Error("Toast dispatcher is not initialized. Make sure to call useToastDispatcher in a component.");
  }
  return toastDispatcher;
};