import MenuItemDTO from '../../Application/Port/DTO/MenuItemDTO';

export default class MenuItem {
  constructor(
    private type: 'page' | 'subMenu',
    private name: string,
    private pageId?: string,
    private items?: MenuItem[],
  ) {}
  
  public toDTO(): MenuItemDTO {
    if (this.type === 'page') {
      if (!this.pageId) {
        throw new Error('Page menu item must have a pageId');
      }

      return {
        type: this.type,
        name: this.name,
        pageId: this.pageId,
      };
    }

    if (!this.items) {
      throw new Error('SubMenu menu item must have items');
    }

    return {
      type: this.type,
      name: this.name,
      items: this.items.map(item => item.toDTO()),
    };
  }
}