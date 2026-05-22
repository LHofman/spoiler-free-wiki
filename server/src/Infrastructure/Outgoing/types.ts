export type MenuItemPage = { type: 'page'; pageId: string };
export type MenuItemSubMenu = { type: 'subMenu'; name: string; items: IMenuItem[] };
export type IMenuItem = MenuItemPage | MenuItemSubMenu;

export interface IMenuDoc {
  _id: string;
  name: string;
  items: IMenuItem[];
}

export interface IPageDoc {
  _id: string;
  title: ITextItemSchemaDoc[];
  text: ITextItemSchemaDoc[][];
  properties: {
    property: string;
    value: ITextItemSchemaDoc[];
  }[];
  textSections: ITextSectionSchemaDoc[];
}

export interface ITextItemSchemaDoc {
  text: string;
  season: number;
  episode: number;
}

export interface ITextSectionSchemaDoc {
  title: ITextItemSchemaDoc[];
  text: ITextItemSchemaDoc[][];
}