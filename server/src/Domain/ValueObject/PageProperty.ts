import PagePropertyDTO from '../../Application/Port/DTO/PagePropertyDTO';
import TextItemVersions from './TextItemVersions';

export default class PageProperty {
  constructor(
    private property: string,
    private value: TextItemVersions
  ) {}
  
  public toDTO(season: number = 0, episode: number = 0): PagePropertyDTO|null {
    const value = this.value.getSpoilerFreeText(season, episode);
    if (!value) return null;

    return { property: this.property, value };
  }
}