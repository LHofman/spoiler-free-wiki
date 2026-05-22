import mongoose, { Document } from 'mongoose';
import TextItemSchema, { ITextItemSchemaDoc } from './TextItemSchema';

export interface ITextSectionSchemaDoc extends Document {
  title: ITextItemSchemaDoc[];
  text: ITextItemSchemaDoc[][];
}

const TextSectionSchema = new mongoose.Schema({
  title: [TextItemSchema],
  text: [[TextItemSchema]],
}, { _id : false });

export default TextSectionSchema;