import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FlightOffersPricingResult, FlightOffersSearchPostResult, FlightOrdersResult } from 'amadeus-ts';

interface FlightSearchQuery{
    originLocationCode: string,
    destinationLocationCode: string,
    fromSelectedOption: string,
    toSelectedOption: string,
    departureDate: string,
    returnDate?: string,
    adults: number,
    children?: number,
    infants?: number,
    travelClass: string,
    nonStop?: boolean,
    currencyCode: string,
}

interface FlightState {
    selectedFlightOffer: FlightOffersSearchPostResult | undefined,
    selectedFlightPrice: FlightOffersPricingResult | undefined,
    flightOrder: FlightOrdersResult | undefined,
    searchQuery: FlightSearchQuery | undefined,
}

const initialState: FlightState = {
    selectedFlightOffer: undefined,
    selectedFlightPrice: undefined,
    flightOrder: undefined,
    searchQuery: undefined,
};

export const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        setFlightSearchQuery(state, action: PayloadAction<FlightSearchQuery>) {
            state.searchQuery = action.payload;
        },
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

export const { setFlightSearchQuery, selectFlightOffer, resetFlightOffer, selectFlightPrice, resetFlightPrice, setFlightOrder, resetFlightOrder } = flightSlice.actions;

export default flightSlice.reducer;