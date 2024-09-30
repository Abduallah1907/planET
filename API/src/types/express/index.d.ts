import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { ICart } from '@/interfaces/ICart';
import { IGovernor } from '@/interfaces/IGovernor';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }



  export namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type ActivityModel = Model<IActivity & Document>;
    export type AdvertiserModel = Model<IAdvertiser & Document>;
    export type Bookmark_notifyModel = Model<IBookmark_notify & Document>;
    export type CategoryModel = Model<ICategory & Document>;
    export type Comment_ratingModel = Model<IComment_rating & Document>;
    export type ComplaintModel = Model<IComplaint & Document>;
    export type GovernorModel = Model<IGovernor & Document>;
    export type Historical_locationsModel = Model<IHistorical_locations & Document>;
    export type ItineraryModel = Model<IItinerary & Document>;
    export type OrderModel = Model<IOrder & Document>;
    export type Previous_workModel = Model<IPrevious_work & Document>;
    export type ProductModel = Model<IProduct & Document>;
    export type Promo_codeModel = Model<IPromo_code & Document>;
    export type SellerModel = Model<ISeller & Document>;
    export type SlotModel = Model<ISlot & Document>;
    export type TicketModel = Model<ITicket & Document>;
    export type Tour_guideModel = Model<ITour_guide & Document>;
    export type TouristModel = Model<ITourist & Document>;
    export type WishlistModel = Model<IWishlist & Document>;

  }
}