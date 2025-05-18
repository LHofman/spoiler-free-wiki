import { IMenuDoc } from '../../Infrastructure/Outgoing/Model/Menu';
import MenuAggregate from '../Aggregate/MenuAggregate';

export default interface MenuRepository {
  getMenuByName(name: string, season: number, episode: number): Promise<MenuAggregate>;

  findRawByName(name: string): Promise<IMenuDoc>;

  update(id: string, body: IMenuDoc): Promise<void>;
}
