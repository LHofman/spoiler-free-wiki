import PageDTO from '../../Application/Port/DTO/PageDTO';

export default interface PageRepository {
  findById(id: string, season?: number, episode?: number): Promise<PageDTO>;
}