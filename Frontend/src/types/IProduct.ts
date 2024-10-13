
export interface IProduct  {
  _id: string;
  user_id: string
  comments: string[];
  name: string;
  average_rating: number;
  description: string;
  picture: string;
  price: number;
  quantity: number;
  sales: number;
  archieve_flag: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviews:number
}

export interface IProductInputDTO {
  name?: string;
  description?: string;
  picture?: string;
  price?: number;
  quantity?: number;
  sales?: number;
  archieve_flag?: boolean;
}
