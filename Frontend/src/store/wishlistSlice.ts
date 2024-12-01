import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface WishlistState {
  products: Product[];
}

interface Product {
  id: any;
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
    addProductToWishlist: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (!existingProduct) {
        state.products.push(action.payload);
      }
    },
    removeProductFromWishlist: (state, action: PayloadAction<any>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    
    clearWishlist: (state) => {
      state.products = [];
    },
  },
});

export const {
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export const wishlistState = (state: RootState) => state.wishlist;

export default wishlistSlice.reducer;
