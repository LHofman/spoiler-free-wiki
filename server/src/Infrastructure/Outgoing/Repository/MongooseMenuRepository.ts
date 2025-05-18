import MenuAggregate from '../../../Domain/Aggregate/MenuAggregate';
import MenuRepository from '../../../Domain/Repository/MenuRepository';
import PageRepository from '../../../Domain/Repository/PageRepository';
import MenuItem from '../../../Domain/ValueObject/MenuItem';
import Menu, { IMenuDoc, IMenuItem } from '../Model/Menu';
import MongooseRepository from './MongooseRepository';

export default class MongooseMenuRepository extends MongooseRepository<IMenuDoc> implements MenuRepository {
  constructor(
    private pageRepository: PageRepository,
  ) {
    super();
  }

  getMenuByName = async (name: string, season: number, episode: number): Promise<MenuAggregate> => {
    const menu = await Menu.findOne({ name });
    if (!menu) throw new Error('Menu not found');

    const allPageIds = this.getAllPageIds(menu.items);
    let pageNames = new Map<string, string | null>();
    if (allPageIds.length > 0) {
      pageNames = await this.pageRepository.getNamesByIds(allPageIds, season, episode);
    }

    const menuItems = this.transformMenuItems(menu.items, pageNames);

    return new MenuAggregate(menu.id, menu.name, menuItems);
  }

  private getAllPageIds = (items: IMenuItem[]): string[] =>
    items.reduce((acc: string[], item: IMenuItem) => {
      if (item.type === 'page') return acc.concat(item.pageId);
      return acc.concat(...this.getAllPageIds(item.items));
    }, []);

  private transformMenuItems = (menuItems: IMenuItem[], pageNames: Map<string, string | null>): MenuItem[] => {
    const transformedMenuItems: MenuItem[] = [];

    for (const item of menuItems) {
      if (item.type === 'page') {
        const pageName = pageNames.get(item.pageId);
        if (pageName) {
          transformedMenuItems.push(new MenuItem(item.type, pageName, item.pageId));
        }
      } else {
        const subItems = this.transformMenuItems(item.items, pageNames);
        if (subItems) {
          transformedMenuItems.push(new MenuItem(item.type, item.name, undefined, subItems));
        }
      }
    }

    return transformedMenuItems;
  }
    

  findRawByName = async (name: string): Promise<IMenuDoc> => {
    const menu = await Menu.findOne({ name });
    if (!menu) throw new Error('Menu not found');

    return menu;
  }

  update = async (id: string, body: IMenuDoc): Promise<void> => {
    await Menu.findByIdAndUpdate(id, body);
  }
}