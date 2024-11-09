import { ToastTypes } from '../utils/toastTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Toast {
    id: string;
    message: string;
    type: ToastTypes;
}

interface ToastsState {
    toasts: Toast[];
}

const initialState: ToastsState = {
    toasts: [],
};

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Toast>) => {
            state.toasts.push(action.payload);
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = toastsSlice.actions;

export const toastState = (state: RootState) => state.toasts;

export default toastsSlice.reducer;