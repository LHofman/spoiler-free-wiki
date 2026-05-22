import dotenv from 'dotenv';
import FileStoragePageRepository from '../../Infrastructure/Outgoing/FileStorage/Repository/FileStoragePageRepository';
import MongoosePageRepository from '../../Infrastructure/Outgoing/Mongoose/Repository/MongoosePageRepository';
import type { IPageDoc } from '../../Infrastructure/Outgoing/types';
import PageAggregate from '../Aggregate/PageAggregate';
import PageListAggregate from '../Aggregate/PageListAggregate';

dotenv.config();

export default interface PageRepository {
  generateId(): string;

  getList(): Promise<PageListAggregate>;

  findById(id: string): Promise<PageAggregate>;

  findRawById(id: string): Promise<IPageDoc>;

  getNamesByIds(ids: string[], season: number, episode: number): Promise<Map<string, string | null>>;
  
  add(body: {
    id: string,
    title: { text: string, season: number, episode: number }[],
  }): Promise<void>;

  update(id: string, body: IPageDoc): Promise<void>;

  delete(id: string): Promise<void>;
}

let pageRepositoryInstance: PageRepository | null = null;

export function getPageRepository(): PageRepository {
  if (!pageRepositoryInstance) {
    if (process.env.USE_MOCK_DATA) {
      pageRepositoryInstance = new FileStoragePageRepository();
    } else {
      pageRepositoryInstance = new MongoosePageRepository();
    }
  }
  return pageRepositoryInstance;
}
