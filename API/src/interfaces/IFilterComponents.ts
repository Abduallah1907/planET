export interface IFilterComponents {
  Category?: {
    type: string;
    values: string[];
  };
  Price?: {
    type: string;
    min: number;
    max: number;
  };
  Rating?: {
    type: string;
    min: number;
    max: number;
  };
  Date?: {
    type: string;
    start: Date;
    end: Date;
  };
}
