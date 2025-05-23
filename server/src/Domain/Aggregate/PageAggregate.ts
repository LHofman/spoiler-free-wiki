import PageDTO from '../../Application/Port/DTO/PageDTO';
import PageProperty from '../ValueObject/PageProperty';
import TextItemVersions from '../ValueObject/TextItemVersions';
import TextSection from '../ValueObject/TextSection';

export default class PageAggregate {
  constructor(
    private id: string,
    private title: TextItemVersions,
    private properties: PageProperty[],
    private text: TextItemVersions[],
    private textSections: TextSection[],
  ) {}

  public toDTO(season: number = 0, episode: number = 0): PageDTO|null {
    const title = this.title.getSpoilerFreeText(season, episode)
    if (!title) return null;

    return {
      _id: this.id,
      title,
      properties: this.properties
        .map((property) => property.toDTO(season, episode))
        .filter((property) => !!property),
      text: this.text.map((textItemVersions: TextItemVersions) => {
        return textItemVersions.getSpoilerFreeText(season, episode);
      }).filter((text: string|null) => text !== null),
      textSections: this.textSections.map((textSection) => textSection.toDTO(season, episode))
        .filter((textSection) => textSection !== null),
    }
  }
}