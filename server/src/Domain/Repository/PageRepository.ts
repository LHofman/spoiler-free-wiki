import PageList from '../../Application/Port/DTO/PageList';
import { IPageDoc } from '../../Infrastructure/Outgoing/Model/Page';
import PageAggregate from '../Aggregate/PageAggregate';

export default interface PageRepository {
  getList(): Promise<PageList>;

  findById(id: string): Promise<PageAggregate>;

  findRawById(id: string): Promise<IPageDoc>;
  
  add(body: { title: string }): Promise<IPageDoc>;

  update(id: string, body: IPageDoc): Promise<void>;

  delete(id: string): Promise<void>;
}
