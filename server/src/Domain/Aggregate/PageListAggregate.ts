import PageListItemDTO from '../../Application/Port/DTO/PageListItemDTO';
import PageListItem from '../ValueObject/PageListItem';

export default class PageListAggregate {
  constructor(
    private items: PageListItem[],
  ) {}

  public toDTO(season: number = 0, episode: number = 0): PageListItemDTO[] {
    return this.items
      .map((title) => title.toDTO(season, episode))
      .filter((title) => !!title);
  }
}