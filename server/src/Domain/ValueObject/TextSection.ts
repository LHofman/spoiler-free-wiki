import TextSectionDTO from '../../Application/Port/DTO/TextSectionDTO';
import TextItemVersions from './TextItemVersions';

export default class TextSection {
  constructor(
    private title: TextItemVersions,
    private text: TextItemVersions[],
  ) {}
  
  public toDTO(season: number = 0, episode: number = 0): TextSectionDTO|null {
    const title = this.title.getSpoilerFreeText(season, episode);
    if (!title) return null;

    const text = this.text.map((textItemVersions: TextItemVersions) => {
      return textItemVersions.getSpoilerFreeText(season, episode);
    }).filter((text: string|null) => text !== null)
    if (!text.length) return null;

    return { title, text };
  }
}