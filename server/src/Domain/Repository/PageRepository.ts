import mongoose from 'mongoose';
import { IPageDoc } from '../../Infrastructure/Outgoing/Model/Page';
import PageAggregate from '../Aggregate/PageAggregate';
import PageListAggregate from '../Aggregate/PageListAggregate';

export default interface PageRepository {
  getList(): Promise<PageListAggregate>;

  findById(id: string): Promise<PageAggregate>;

  findRawById(id: string): Promise<IPageDoc>;

  getNamesByIds(ids: string[], season: number, episode: number): Promise<Map<string, string | null>>;
  
  add(body: {
    _id: mongoose.Types.ObjectId,
    title: { text: string, season: number, episode: number }[],
  }): Promise<void>;

  update(id: string, body: IPageDoc): Promise<void>;

  delete(id: string): Promise<void>;
}
