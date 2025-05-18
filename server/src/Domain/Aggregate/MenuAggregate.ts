import MenuDTO from '../../Application/Port/DTO/MenuDTO';
import MenuItem from '../ValueObject/MenuItem';

export default class MenuAggregate {
  constructor(
    private id: string,
    private name: string,
    private items: MenuItem[],
  ) {}

  public toDTO(): MenuDTO {
    return {
      id: this.id,
      name: this.name,
      items: this.items.map((item) => item.toDTO()),
    }
  }
}