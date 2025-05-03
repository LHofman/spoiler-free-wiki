import PageDTO from '../../Application/Port/DTO/PageDTO';
import TextItemVersions from '../ValueObject/TextItemVersions';

export default class PageAggregate {
  constructor(
    private id: string,
    private title: string,
    private text: TextItemVersions[],
  ) {}

  public toDTO(season: number = 0, episode: number = 0): PageDTO {
    return {
      id: this.id,
      title: this.title,
      text: this.text.map((textItemVersions: TextItemVersions) => {
        return textItemVersions.getSpoilerFreeText(season, episode);
      }).filter((text: string|null) => text !== null),
    }
  }
}