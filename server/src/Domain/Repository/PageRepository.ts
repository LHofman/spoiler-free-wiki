import { IPageDoc } from '../../Infrastructure/Outgoing/Model/Page';
import PageAggregate from '../Aggregate/PageAggregate';

export default interface PageRepository {
  findById(id: string): Promise<PageAggregate>;

  findRawById(id: string): Promise<IPageDoc>;
}
