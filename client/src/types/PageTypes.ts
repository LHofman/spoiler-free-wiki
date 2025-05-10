export interface PageDetails {
  _id: string;
  title: string;
  text: string[];
}

export interface Page {
  _id: string;
  title: string;
  text: TextItem[][];
}
export interface TextItem {
  text: string;
  season: number;
  episode: number;
}
