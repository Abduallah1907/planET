import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SidebarState {
    isActive: boolean;
    isOpen: boolean;
}

const initialState: SidebarState = {
    isActive: true,
    isOpen: false,
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        activateSidebar(state){
            state.isActive = true
        },
        toggleSidebar(state) {
            state.isOpen = !state.isOpen;
        },
        openSidebar(state) {
            state.isOpen = true;
        },
        closeSidebar(state) {
            state.isOpen = false;
        },
    },
});

export const { activateSidebar, toggleSidebar, openSidebar, closeSidebar } = sidebarSlice.actions;

export const sidebarState = (state: RootState) => state.sidebar.isOpen

export default sidebarSlice.reducer;