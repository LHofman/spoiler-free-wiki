import fs from 'fs';
import path from 'path';
import { createPatch } from 'rfc6902';

const historyFilePath = path.resolve(__dirname, '../Data/history.json');

export default class FileStorageRepository {
  private history: object[];
    
  constructor() {
    this.history = JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));
  }

  generateId(): string {
    return 'mockid-' + Math.random().toString(36).substring(2, 15);
  }

  protected saveDiffInHistory = (
    modelType: 'Menu' | 'Page',
    id: string,
    oldData: object,
    newData: object
  ): void => {
    const historyEntry = {
      'id': this.generateId(),
      'modelType': 'Page',
      'modelId': id,
      'timestamp': new Date().toISOString(),
      'changes': createPatch(oldData, newData),
    }

    this.history.push(historyEntry);
    fs.writeFileSync(historyFilePath, JSON.stringify(this.history, null, 2), 'utf-8');
  }

  protected saveDeleteInHistory = (
    modelType: 'Menu' | 'Page',
    id: string
  ): void => {
    const historyEntry = {
      'id': this.generateId(),
      'modelType': modelType,
      'modelId': id,
      'timestamp': new Date().toISOString(),
      'changes': 'Delete',
    };
    
    this.history.push(historyEntry);
    fs.writeFileSync(historyFilePath, JSON.stringify(this.history, null, 2), 'utf-8');
  }
}