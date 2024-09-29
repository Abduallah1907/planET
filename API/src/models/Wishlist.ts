import { IWishlist } from '@/interfaces/IWishlist';
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
   
    user_id: {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'User'
    },
    products: [{
        type: mongoose.Schema.Types.Number,
        ref: 'Product'
    }]
}, { timestamps: true });

const Wishlist = mongoose.model<IWishlist & mongoose.Document>('Wishlist', wishlistSchema);

export default Wishlist;