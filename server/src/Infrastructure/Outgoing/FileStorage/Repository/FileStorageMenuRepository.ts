import fs from 'fs';
import path from 'path';
import MenuAggregate from '../../../../Domain/Aggregate/MenuAggregate';
import MenuRepository from '../../../../Domain/Repository/MenuRepository';
import PageRepository from '../../../../Domain/Repository/PageRepository';
import MenuItem from '../../../../Domain/ValueObject/MenuItem';
import type { IMenuDoc, IMenuItem } from '../../types';

const dataFilePath = path.resolve(__dirname, '../Data/menus.json');

export default class FileStorageMenuRepository implements MenuRepository {
  private menus: IMenuDoc[];

  constructor(
    private pageRepository: PageRepository,
  ) {
    this.menus = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  }

  getMenuByName = async (name: string, season: number, episode: number): Promise<MenuAggregate> => {
    const menu = this.menus.find((menu: IMenuDoc) => menu.name === name);
    if (!menu) throw new Error('Menu not found');

    const allPageIds = this.getAllPageIds(menu.items);
    let pageNames = new Map<string, string | null>();
    if (allPageIds.length > 0) {
      pageNames = await this.pageRepository.getNamesByIds(allPageIds, season, episode);
    }

    const menuItems = this.transformMenuItems(menu.items, pageNames);

    return new MenuAggregate(menu._id, menu.name, menuItems);
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

  findRawByName(name: string): Promise<IMenuDoc> {
    const menu = this.menus.find((menu: IMenuDoc) => menu.name === name);
    if (!menu) throw new Error('Menu not found');
    return Promise.resolve(menu);
  }

  update = async (id: string, body: IMenuDoc): Promise<void> => {
    const menuIndex = this.menus.findIndex((menu: IMenuDoc) => menu._id === id);
    if (menuIndex === -1) {
      throw new Error('Menu not found');
    }

    this.menus[menuIndex] = { ...this.menus[menuIndex], ...body };
    this.saveToFile();
  }

  private saveToFile = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.menus, null, 2), 'utf-8');
  }
}