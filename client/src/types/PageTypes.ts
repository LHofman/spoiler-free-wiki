export interface PageDetails {
  _id: string;
  title: string;
  properties: {
    property: string;
    value: string;
  }[];
  text: string[];
  textSections: {
    title: string;
    text: string[];
  }[];
}

export interface Page {
  _id: string;
  title: string;
  properties: Property[];
  text: TextItem[][];
  textSections: TextSection[];
}
export interface Property {
  property: string;
  value: TextItem[];
}
export interface TextItem {
  text: string;
  season: number;
  episode: number;
}
export interface TextSection {
  title: TextItem[];
  text: TextItem[][];
}