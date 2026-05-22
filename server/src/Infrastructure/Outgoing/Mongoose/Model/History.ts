import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';
export type MenuItemPage = { type: 'page'; pageId: string };
export type MenuItemSubMenu = { type: 'subMenu'; name: string; items: IMenuItem[] };
export type IMenuItem = MenuItemPage | MenuItemSubMenu;

export interface IHistoryDoc extends Document {
  _id: ObjectId;
  modelType: 'Menu' | 'Page';
  modelId: ObjectId;
  timestamp: string;
  changes: object[] | 'Delete';
}

const HistorySchema = new mongoose.Schema({
  modelType: { type: String, required: true, enum: ['Menu', 'Page'] },
  modelId: { type: mongoose.Types.ObjectId, required: true },
  timestamp: { type: String, required: true },
  changes: { type: mongoose.Schema.Types.Mixed, required: true },
});

export default mongoose.model<IHistoryDoc>('History', HistorySchema);