import PageAggregate from '../Aggregate/PageAggregate';

export default interface PageRepository {
  findById(id: string): Promise<PageAggregate>;
}
