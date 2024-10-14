
export interface IItinerary {
  average_rating: number;
  Reviews: number;
  activities: string[];
  timeline: string[];
  comments: string[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: string[];
  active_flag: boolean;
  inappropriate_flag: boolean;
  tour_guide_id: string;
  name: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  reviews_count?: number;
}

export interface IItineraryCreateDTO {
  tour_guide_user_id: string;
  name: string;
  category: string;
  activities: string[];
  timeline: string[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: string[];
}

export interface IItineraryUpdateDTO {
  name: string;
  category: string;
  activities: string[];
  timeline: string[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: string[];
}

export interface IItineraryOutputDTO {
  itinerary_id: string;
  activities: string[];
  timeline: string[];
  comments: string[];
  category: string;
  name: String;
  locations: string[];
  languages: string[];
  available_dates: Date[];
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: string[];
  tour_guide_id: string;
}
