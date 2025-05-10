import PageDTO from '../../Application/Port/DTO/PageDTO';
import PageProperty from '../ValueObject/PageProperty';
import TextItemVersions from '../ValueObject/TextItemVersions';

export default class PageAggregate {
  constructor(
    private id: string,
    private title: string,
    private text: TextItemVersions[],
    private properties: PageProperty[],
  ) {}

  public toDTO(season: number = 0, episode: number = 0): PageDTO {
    return {
      _id: this.id,
      title: this.title,
      text: this.text.map((textItemVersions: TextItemVersions) => {
        return textItemVersions.getSpoilerFreeText(season, episode);
      }).filter((text: string|null) => text !== null),
      properties: this.properties
        .map((property) => property.toDTO(season, episode))
        .filter((property) => !!property),
    }
  }
}