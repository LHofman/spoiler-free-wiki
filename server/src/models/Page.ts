import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

export default mongoose.model('Page', PageSchema);