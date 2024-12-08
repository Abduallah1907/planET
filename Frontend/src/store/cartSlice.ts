import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { useNavigate } from 'react-router-dom';
import { clear } from 'console';

interface Product {
    id: any;
    name: string;
    price: number;
    description: string;
    image: any;
    // add other properties of Product here
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    products: CartItem[];
    total: number;
    promoCode: string;
    discountPercent: number;
}

const initialState: CartState = {
    products: [],
    total: 0,
    promoCode: "",
    discountPercent: 0,
};
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<CartItem>) => {
            const existingProduct = state.products.find((item) => item.product.id === action.payload.product.id);
            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity;
            } else {
                state.products.push(action.payload);
            }
            state.total += action.payload.product.price * action.payload.quantity;
        },
        removeProduct: (state, action: PayloadAction<number>) => {
            const product = state.products[action.payload];
            state.products.splice(action.payload, 1);
            state.total -= product.product.price * product.quantity;
        },
        updateQuantity: (state, action: PayloadAction<{ index: number; quantity: number }>) => {
            const product = state.products[action.payload.index];
            state.total += (action.payload.quantity - product.quantity) * product.product.price;
            product.quantity = action.payload.quantity;
        },
        clearCart: (state) => {
            state.products = [];
            state.total = 0;
        },
        addPromoCode: (state, action: PayloadAction<{ promoCode: string; discountPercent: number }>) => {
            state.promoCode = action.payload.promoCode;
            state.discountPercent = action.payload.discountPercent;
        }
    }
});

export const { addProduct, removeProduct, updateQuantity, clearCart, addPromoCode } = cartSlice.actions;

export const cartState = (state: RootState) => state.cart;


export default cartSlice.reducer;
