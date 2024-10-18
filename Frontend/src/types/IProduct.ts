export interface IProduct {
  _id: string;
  user_id: string;
  comments: string[];
  name: string;
  average_rating: number;
  description: string;
  image?: string;
  price: number;
  quantity: number;
  sales: number;
  archieve_flag: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviews_count:number
}

export interface IProductInputDTO {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  quantity?: number;
  sales?: number;
  archieve_flag?: boolean;
}
