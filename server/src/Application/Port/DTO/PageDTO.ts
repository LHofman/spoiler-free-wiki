import PagePropertyDTO from './PagePropertyDTO';
import TextSectionDTO from './TextSectionDTO';

export default interface PageDTO {
  _id: string;
  title: string;
  properties: PagePropertyDTO[];
  text: string[];
  textSections: TextSectionDTO[];
}