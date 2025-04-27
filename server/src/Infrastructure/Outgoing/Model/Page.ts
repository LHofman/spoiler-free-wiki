import mongoose, { Document } from 'mongoose';
import TextItemSchema, { ITextItemSchemaDoc } from './TextItemSchema';

export interface IPageDoc extends Document {
  _id: string;
  title: string;
  text: ITextItemSchemaDoc[][];
}

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: [[TextItemSchema]],
});

export default mongoose.model<IPageDoc>('Page', PageSchema);