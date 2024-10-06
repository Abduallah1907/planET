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
  Date?: {
    type: Date;
    start: Date;
    end: Date;
  };
}
