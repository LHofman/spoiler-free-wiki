import mongoose, { Document } from 'mongoose';
import TextItemSchema, { ITextItemSchemaDoc } from './TextItemSchema';

export interface IPageDoc extends Document {
  _id: string;
  title: string;
  text: ITextItemSchemaDoc[][];
  properties: {
    property: string;
    value: ITextItemSchemaDoc[];
  }[];
}

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: [[TextItemSchema]],
  properties: [{
    property: String,
    value: [TextItemSchema]
  }],
});

export default mongoose.model<IPageDoc>('Page', PageSchema);