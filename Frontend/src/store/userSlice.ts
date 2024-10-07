import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface UserState {
    job: any;
    id(id: any, arg1: { name: string; email: any; job: any; }): unknown;
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
    isLoggedIn: undefined,
    job: undefined,
    id: function (id: any, arg1: { name: string; email: any; job: any; }): unknown {
        throw new Error('Function not implemented.');
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            const {name, _id, username, role, email, phone_number, status, token, stakeholder_id } = action.payload;
            state.name=name;
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
        }
    }
});

export const { setUser, getUser } = userSlice.actions;

export const userState = (state: RootState) => state.sidebar;

export default userSlice.reducer;
