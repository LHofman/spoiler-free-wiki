import mongoose, { Document } from 'mongoose';

export type MenuItemPage = { type: 'page'; pageId: string };
export type MenuItemSubMenu = { type: 'subMenu'; name: string; items: IMenuItem[] };
export type IMenuItem = MenuItemPage | MenuItemSubMenu;

export interface IMenuDoc extends Document {
  _id: string;
  name: string;
  items: IMenuItem[];
}

const MenuItemSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['page', 'subMenu'] },
  pageId: { type: String, required: (menuItem: any) => menuItem.type === 'page' },
  name: { type: String, required: (menuItem: any) => menuItem.type === 'subMenu' },
  items: { type: [this], required: (menuItem: any) => menuItem.type === 'subMenu' },
}, { _id : false });

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{
    name: { type: String },
    pageId: { type: String },
    items: [MenuItemSchema],
  }],
});

export default mongoose.model<IMenuDoc>('Menu', MenuSchema);