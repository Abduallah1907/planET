import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { useNavigate } from 'react-router-dom';

interface UserState {
    avatar: string | undefined;
    job: any;
    isLoggedIn: any;
    name: string;
    _id: string;
    username: string;
    role: string;
    email: string;
    phone_number: string;
    status: string;
    token: string;
    stakeholder_id: any;
}

const initialState: UserState = {
    name: '',
    _id: '',
    username: '',
    role: '',
    email: '',
    phone_number: '',
    status: '',
    token: '',
    stakeholder_id: undefined,
    isLoggedIn: false,
    job: undefined,
    avatar: undefined
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setStakeholder(state, action: PayloadAction<Object>) {
            state.stakeholder_id = action.payload;
        },
        setUser: (state, action: PayloadAction<UserState>) => {
            const { name, _id, username, role, email, phone_number, status, token, stakeholder_id } = action.payload;
            state.name = name;
            state._id = _id;
            state.username = username;
            state.role = role;
            state.email = email;
            state.phone_number = phone_number;
            state.status = status;
            state.token = token;
            state.stakeholder_id = stakeholder_id;
        },
        getUser: (state) => {
            return state;
        },
        login: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.name = '';
            state._id = '';
            state.username = '';
            state.role = '';
            state.email = '';
            state.phone_number = '';
            state.status = '';
            state.token = '';
            state.stakeholder_id = undefined;
        },
        setLoginState: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
        setWalletBalance: (state, action: PayloadAction<number>) => {
            state.stakeholder_id.wallet = action.payload;
        },
    },
});

export const { setUser, getUser, logout, login, setLoginState, setStakeholder, setWalletBalance } = userSlice.actions;

export const userState = (state: RootState) => state.sidebar;

export default userSlice.reducer;
