import mongoose, { Document } from 'mongoose';
import InvalidIdError from '../../../Domain/Error/InvalidIdError';

export default abstract class MongooseRepository<M extends Document> {
  protected toObjectId(id: string): mongoose.Types.ObjectId {
    try {
      return new mongoose.Types.ObjectId(id);
    } catch (error) {
      throw new InvalidIdError(id);
    }
  }

  protected validateDocumentExists(documentResult: M|null): void {
    if (!documentResult) {
      throw new Error('');
    }
  }
}