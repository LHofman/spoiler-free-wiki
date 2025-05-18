import MenuItemDTO from '../../Application/Port/DTO/MenuItemDTO';

export default class MenuItem {
  constructor(
    private type: 'page' | 'subMenu',
    private name: string,
    private pageId?: string,
    private items?: MenuItem[],
  ) {}
  
  public toDTO(): MenuItemDTO {
    return {
      type: this.type,
      name: this.name,
      pageId: this.pageId,
      items: this.items ? this.items.map(item => item.toDTO()) : undefined,
    };
  }
}