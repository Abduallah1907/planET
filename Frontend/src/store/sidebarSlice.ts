import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SidebarState {
    isActive: boolean;
    isOpen: boolean;
    navItems: any;
}

const initialState: SidebarState = {
    isActive: false,
    isOpen: false,
    navItems: [],
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setNavItems(state, action: PayloadAction<any>) {
            state.navItems = action.payload;
        },
        getNavItems(state) {
            return state.navItems;
        },
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

export const { activateSidebar, toggleSidebar, openSidebar, closeSidebar,setNavItems,getNavItems } = sidebarSlice.actions;

export const sidebarState = (state: RootState) => state.sidebar.isOpen

export default sidebarSlice.reducer;