export default interface MenuItemDTO {
  type: 'page' | 'subMenu';
  name: string;
  pageId?: string;
  items?: MenuItemDTO[];
}