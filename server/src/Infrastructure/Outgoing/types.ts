export type MenuItemPage = { type: 'page'; pageId: string };
export type MenuItemSubMenu = { type: 'subMenu'; name: string; items: IMenuItem[] };
export type IMenuItem = MenuItemPage | MenuItemSubMenu;

export interface IMenuRaw {
  _id: string;
  name: string;
  items: IMenuItem[];
}

export interface IPageRaw {
  _id: string;
  title: ITextItemSchemaRaw[];
  text: ITextItemSchemaRaw[][];
  properties: {
    property: string;
    value: ITextItemSchemaRaw[];
  }[];
  textSections: ITextSectionSchemaRaw[];
}

export interface ITextItemSchemaRaw {
  text: string;
  season: number;
  episode: number;
}

export interface ITextSectionSchemaRaw {
  title: ITextItemSchemaRaw[];
  text: ITextItemSchemaRaw[][];
}