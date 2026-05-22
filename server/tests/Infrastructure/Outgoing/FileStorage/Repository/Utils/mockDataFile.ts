import fs from 'fs';
import { before, beforeEach, mock } from 'node:test';

let mockData: { [key: string]: object[] } = {};

export const mockDataFiles = (originalMockData: { [key: string]: object[]}) => {
  mockData = {...originalMockData};

  before(() => {
    mock.method(fs, 'readFileSync', (filePath: string, encoding: string) => {
      const fileName = filePath.split('/').pop() || '';
      return JSON.stringify(mockData[fileName]);
    });
    mock.method(fs, 'writeFileSync', (filePath: string, data: string, encoding: string) => {
      const fileName = filePath.split('/').pop() || '';
      mockData[fileName] = JSON.parse(data);
    });
  });

  beforeEach(() => {
    mockData = {...originalMockData};
  });
}

export const getMockData = (fileName: string): object[] => {
  return mockData[fileName];
}