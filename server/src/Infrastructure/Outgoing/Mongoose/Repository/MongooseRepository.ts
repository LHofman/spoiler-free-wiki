import mongoose, { Document } from 'mongoose';
import { createPatch } from 'rfc6902';
import InvalidIdError from '../../../../Domain/Error/InvalidIdError';
import History from '../Model/History';

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
  
  protected saveDiffInHistory = async (
    modelType: 'Menu' | 'Page',
    id: mongoose.Types.ObjectId,
    oldData: object,
    newData: object
  ): Promise<void> => {
    const historyEntry = {
      modelType,
      modelId: id,
      timestamp: new Date().toISOString(),
      changes: createPatch(oldData, newData),
    }

    await History.create(historyEntry);
  }
  
  protected saveDeleteInHistory = async (
    modelType: 'Menu' | 'Page',
    id: mongoose.Types.ObjectId,
  ): Promise<void> => {
    const historyEntry = {
      modelType: modelType,
      modelId: id,
      timestamp: new Date().toISOString(),
      changes: 'Delete',
    };

    await History.create(historyEntry);
  }
}