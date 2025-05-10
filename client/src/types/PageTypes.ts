export interface PageDetails {
  _id: string;
  title: string;
  text: string[];
  properties: {
    property: string;
    value: string;
  }[];
}

export interface Page {
  _id: string;
  title: string;
  text: TextItem[][];
  properties: Property[];
}
export interface TextItem {
  text: string;
  season: number;
  episode: number;
}
export interface Property {
  property: string;
  value: TextItem[];
}