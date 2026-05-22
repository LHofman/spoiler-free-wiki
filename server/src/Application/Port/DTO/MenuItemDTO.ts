type MenuItemDTO = MenuItemPageDTO | MenuItemSubMenuDTO;
export default MenuItemDTO;

export interface MenuItemPageDTO {
  type: 'page';
  name: string;
  pageId: string;
}

export interface MenuItemSubMenuDTO {
  type: 'subMenu';
  name: string;
  items: MenuItemDTO[];
}