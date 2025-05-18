import PageListItemDTO from '../../Application/Port/DTO/PageListItemDTO';
import TextItemVersions from './TextItemVersions';

export default class PageListItem {
  constructor(
    private id: string,
    private title: TextItemVersions,
    private canDelete: boolean,
  ) {}
  
  public toDTO(season: number = 0, episode: number = 0): PageListItemDTO|null {
    const title = this.title.getSpoilerFreeText(season, episode);
    if (!title) return null;

    return { id: this.id, title, canDelete: this.canDelete };
  }
}