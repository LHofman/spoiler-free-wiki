import PagePropertyDTO from './PagePropertyDTO';

export default interface PageDTO {
  _id: string;
  title: string;
  text: string[];
  properties: PagePropertyDTO[];
}