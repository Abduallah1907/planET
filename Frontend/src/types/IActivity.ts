

export interface IActivity  {
  _id: string;
  average_rating: number;
  category: string;
  comments: string[];
  name: string;
  date: Date;
  time: string;
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional) check the users story 21 in azure
    min: number;
    max: number;
  };
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  advertiser_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IActivityDTO {
  name: string;
  date: Date;
  time: string;
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional)
    min: number;
    max: number;
  };
  category: string;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  advertiser_id: string;
}
export interface UpdateIActivityDTO {
  name?: string;
  date?: Date;
  time?: string;
  location?: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional)
    min?: number;
    max?: number;
  };
  category?: string;
  special_discount?: number;
  tags?: string[];
  booking_flag?: boolean;
  advertiser_id?: string;
}
