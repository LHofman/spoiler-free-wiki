import mongoose, { Document } from 'mongoose';
import TextItemSchema, { ITextItemSchemaDoc } from './TextItemSchema';
import TextSectionSchema, { ITextSectionSchemaDoc } from './TextSectionSchema';

export interface IPageDoc extends Document {
  _id: string;
  title: ITextItemSchemaDoc[];
  text: ITextItemSchemaDoc[][];
  properties: {
    property: string;
    value: ITextItemSchemaDoc[];
  }[];
  textSections: ITextSectionSchemaDoc[];
}

const PageSchema = new mongoose.Schema({
  title: [TextItemSchema],
  properties: [{
    property: String,
    value: [TextItemSchema]
  }],
  text: [[TextItemSchema]],
  textSections: [TextSectionSchema],
});

export default mongoose.model<IPageDoc>('Page', PageSchema);