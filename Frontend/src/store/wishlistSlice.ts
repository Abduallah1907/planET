import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface WishlistState {
  products: Product[];
}

interface Product {
  _id: any;
  name: string;
  price: number;
  description: string;
  image: any;
  // Add other properties of Product here if needed
}

const initialState: WishlistState = {
  products: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    addProductToWishlist: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (!existingProduct) {
        state.products.push(action.payload);
      }
    },
    removeProductFromWishlist: (state, action: PayloadAction<any>) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.products = [];
    },
  },
});

export const {
  setWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export const wishlistState = (state: RootState) => state.wishlist;

export default wishlistSlice.reducer;
