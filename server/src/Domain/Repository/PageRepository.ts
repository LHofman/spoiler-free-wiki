import mongoose from 'mongoose';
import PageList from '../../Application/Port/DTO/PageList';
import { IPageDoc } from '../../Infrastructure/Outgoing/Model/Page';
import PageAggregate from '../Aggregate/PageAggregate';

export default interface PageRepository {
  getList(): Promise<PageList>;

  findById(id: string): Promise<PageAggregate>;

  findRawById(id: string): Promise<IPageDoc>;
  
  add(body: { _id: mongoose.Types.ObjectId, title: string }): Promise<void>;

  update(id: string, body: IPageDoc): Promise<void>;

  delete(id: string): Promise<void>;
}
