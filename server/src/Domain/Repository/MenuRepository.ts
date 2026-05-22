import dotenv from 'dotenv';
import FileStorageMenuRepository from '../../Infrastructure/Outgoing/FileStorage/Repository/FileStorageMenuRepository';
import MongooseMenuRepository from '../../Infrastructure/Outgoing/Mongoose/Repository/MongooseMenuRepository';
import type { IMenuDoc } from '../../Infrastructure/Outgoing/types';
import MenuAggregate from '../Aggregate/MenuAggregate';
import { getPageRepository } from './PageRepository';

dotenv.config();

export default interface MenuRepository {
  getMenuByName(name: string, season: number, episode: number): Promise<MenuAggregate>;

  findRawByName(name: string): Promise<IMenuDoc>;

  update(id: string, body: IMenuDoc): Promise<void>;
}

let menuRepositoryInstance: MenuRepository | null = null;

export function getMenuRepository(): MenuRepository {
  if (!menuRepositoryInstance) {
    if (process.env.USE_MOCK_DATA) {
      menuRepositoryInstance = new FileStorageMenuRepository(
        getPageRepository()
      );
    } else {
      menuRepositoryInstance = new MongooseMenuRepository(
        getPageRepository()
      );
    }
  }
  return menuRepositoryInstance;
}
