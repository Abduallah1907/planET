import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FlightOffersPricingResult, FlightOffersSearchPostResult, FlightOrdersResult } from 'amadeus-ts';

interface FlightState {
    selectedFlightOffer: FlightOffersSearchPostResult | undefined,
    selectedFlightPrice: FlightOffersPricingResult | undefined,
    flightOrder: FlightOrdersResult | undefined,
}

const initialState: FlightState = {
    selectedFlightOffer: undefined,
    selectedFlightPrice: undefined,
    flightOrder: undefined,
};

export const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        selectFlightOffer(state, action: PayloadAction<FlightOffersSearchPostResult>) {
            state.selectedFlightOffer = action.payload;
        },
        resetFlightOffer(state) {
            state.selectedFlightOffer = undefined;
        },
        selectFlightPrice(state, action: PayloadAction<FlightOffersPricingResult>) {
            state.selectedFlightPrice = action.payload;
        },
        resetFlightPrice(state) {
            state.selectedFlightPrice = undefined;
        },
        setFlightOrder(state, action: PayloadAction<FlightOrdersResult>) {
            state.flightOrder = action.payload;
        },
        resetFlightOrder(state) {
            state.flightOrder = undefined;
        }
    },
});

export const { selectFlightOffer, resetFlightOffer, selectFlightPrice, resetFlightPrice, setFlightOrder, resetFlightOrder } = flightSlice.actions;

export default flightSlice.reducer;