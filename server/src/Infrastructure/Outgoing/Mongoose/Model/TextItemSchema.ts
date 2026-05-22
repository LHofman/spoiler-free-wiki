import mongoose, { Document } from 'mongoose';

export interface ITextItemSchemaDoc extends Document {
  text: string;
  season: number;
  episode: number;
}

const TextItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  season: { type: Number, required: true },
  episode: { type: Number, required: true },
}, { _id : false });

export default TextItemSchema;