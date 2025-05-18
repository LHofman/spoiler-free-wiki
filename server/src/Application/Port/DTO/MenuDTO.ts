import MenuItemDTO from './MenuItemDTO';

export default interface MenuDTO {
  id: string;
  name: string;
  items: MenuItemDTO[];
}