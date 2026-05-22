import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import FileStoragePageRepository from '../../../../../src/Infrastructure/Outgoing/FileStorage/Repository/FileStoragePageRepository';
import { getMockData, mockDataFiles } from './Utils/mockDataFile';
import PageListAggregate from '../../../../../src/Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../../../src/Domain/ValueObject/PageListItem';
import TextItemVersions from '../../../../../src/Domain/ValueObject/TextItemVersions';
import TextItem from '../../../../../src/Domain/ValueObject/TextItem';
import PageAggregate from '../../../../../src/Domain/Aggregate/PageAggregate';
import PageProperty from '../../../../../src/Domain/ValueObject/PageProperty';
import TextSection from '../../../../../src/Domain/ValueObject/TextSection';
import { assertEqualWithoutId, assertTimestamp, objectWithoutTimestamp } from './Utils/historyUtils';

const mockPageData: object[] = [
  {
    _id: 'page1',
    title: [ { 'text': 'Page 1', season: 0, episode: 0 } ],
    text: [[
      { 'text': 'Page 1 content', season: 0, episode: 0 },
      { 'text': 'Page 1 future content', season: 1, episode: 5 },
    ]],
    properties: [
      { property: 'Property 1', value: [ { 'text': 'Value 1', season: 0, episode: 0 } ] },
      { property: 'Property 2', value: [
        { 'text': 'Value 2', season: 0, episode: 0 },
        { 'text': 'Value 2 future', season: 1, episode: 7 },
      ] },
    ],
    textSections: [
      {
        title: [ { 'text': 'Section 1', season: 0, episode: 0 } ],
        text: [[
          { 'text': 'Section 1 content', season: 0, episode: 0 },
          { 'text': 'Section 1 future content', season: 1, episode: 5 },
        ]],
      },
    ],
  },
  {
    _id: 'page2',
    title: [ { 'text': 'Page 2', season: 0, episode: 0 } ],
    text: [],
    properties: [],
    textSections: [],
  },
];
const mockHistoryData: object[] = [];

describe('FileStorageMenuRepository', () => {
  let fileStoragePageRepository: FileStoragePageRepository;
  
  mockDataFiles({
    'pages.json': mockPageData,
    'history.json': mockHistoryData,
  });
  
  beforeEach(() => {
    fileStoragePageRepository = new FileStoragePageRepository();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = fileStoragePageRepository.generateId();
      const id2 = fileStoragePageRepository.generateId();
      assert.notEqual(id1, id2);
    });
  });

  describe('getList', () => {
    it('should return list of pages', async () => {
      const pageList = await fileStoragePageRepository.getList();

      const expected = new PageListAggregate([
        new PageListItem(
          'page1',
          new TextItemVersions([new TextItem('Page 1', 0, 0)]),
          false,
        ),
        new PageListItem(
          'page2',
          new TextItemVersions([new TextItem('Page 2', 0, 0)]),
          true, 
        ),
      ]);
      
      assert.deepEqual(pageList, expected);
    });
  });

  describe('findById', () => {
    it('should throw error if page not found', { expectFailure: 'Page not found' }, async () => {
      await fileStoragePageRepository.findById('nonexistent');
    });

    it('should return page aggregate by ID', async () => {
      const page = await fileStoragePageRepository.findById('page1');

      const expected = new PageAggregate(
        'page1',
        new TextItemVersions([new TextItem('Page 1', 0, 0)]),
        [
          new PageProperty(
            'Property 1',
            new TextItemVersions([new TextItem('Value 1', 0, 0)]),
          ),
          new PageProperty(
            'Property 2',
            new TextItemVersions([
              new TextItem('Value 2', 0, 0),
              new TextItem('Value 2 future', 1, 7),
            ]),
          ),
        ],
        [
          new TextItemVersions([
            new TextItem('Page 1 content', 0, 0),
            new TextItem('Page 1 future content', 1, 5),
          ]),
        ],
        [
          new TextSection(
            new TextItemVersions([new TextItem('Section 1', 0, 0)]),
            [
              new TextItemVersions([
                new TextItem('Section 1 content', 0, 0),
                new TextItem('Section 1 future content', 1, 5),
              ]),
            ],
          ),
        ],
      );
      
      assert.deepEqual(page, expected);
    });
  });

  describe('findRawById', () => {
    it('should throw error if page not found', { expectFailure: 'Page not found' }, async () => {
      await fileStoragePageRepository.findRawById('nonexistent');
    });

    it('should return raw page document by ID', async () => {
      const pageDoc = await fileStoragePageRepository.findRawById('page1');
      assert.deepEqual(pageDoc, mockPageData[0]);
    });
  });

  describe('getNamesByIds', () => {
    it('should return map of page IDs to names', async () => {
      const namesMap = await fileStoragePageRepository.getNamesByIds(['page1', 'page2'], 0, 0);
      const expected = new Map<string, string | null>([
        ['page1', 'Page 1'],
        ['page2', 'Page 2'],
      ]);
      assert.deepEqual(namesMap, expected);
    });
  });

  describe('add', () => {
    it('should add new page', async () => {
      const newPageData = {
        id: 'page3',
        title: [ { 'text': 'Page 3', season: 0, episode: 0 } ],
      };
      await fileStoragePageRepository.add(newPageData);
      
      const updatedFile = getMockData('pages.json');

      const expected = [
        ...mockPageData,
        { _id: 'page3', title: newPageData.title, text: [], properties: [], textSections: [] },
      ];

      assert.deepEqual(updatedFile, expected);
    });

    it('should save the new page in the history', async () => {
      const newPageData = {
        id: 'page3',
        title: [ { 'text': 'Page 3', season: 0, episode: 0 } ],
      };
      await fileStoragePageRepository.add(newPageData);

      const historyData = getMockData('history.json');

      const expectedHistoryEntry = {
        'modelType': 'Page',
        'modelId': 'page3',
        'changes': [
          {
            op: 'add',
            path: '/_id',
            value: 'page3',
          },
          {
            op: 'add',
            path: '/title',
            value: [ { text: 'Page 3', season: 0, episode: 0 } ],
          },
          {
            op: 'add',
            path: '/text',
            value: [],
          },
          {
            op: 'add',
            path: '/properties',
            value: [],
          },
          {
            op: 'add',
            path: '/textSections',
            value: [],
          },
        ],
      };

      assertEqualWithoutId(objectWithoutTimestamp(historyData[0]), expectedHistoryEntry);
      // @ts-expect-error - timestamp exists at runtime
      assertTimestamp(historyData[0].timestamp);
    });
  });

  describe('update', () => {
    it('should throw error if page not found', { expectFailure: 'Page not found' }, async () => {
      await fileStoragePageRepository.update('nonexistent', { _id: 'nonexistent', title: [], text: [], properties: [], textSections: [] });
    });

    it('should update existing page', async () => {
      const updatedPageData = { _id: 'page1', title: [ { 'text': 'Updated Page 1', season: 0, episode: 0 } ], text: [], properties: [], textSections: [] };
      await fileStoragePageRepository.update('page1', updatedPageData);
      
      const updatedFile = getMockData('pages.json');

      const expected = [
        updatedPageData,
        ...mockPageData.slice(1),
      ];

      assert.deepEqual(updatedFile, expected);
    });

    it('should save the update in the history', async () => {
      const updatedPageData = {
        ...mockPageData[0],
        title: [ { 'text': 'Updated Page 1', season: 0, episode: 0 } ],
        textSections: []
      };
      // @ts-expect-error
      await fileStoragePageRepository.update('page1', updatedPageData);

      const historyData = getMockData('history.json');

      const expectedHistoryEntry = {
        'modelType': 'Page',
        'modelId': 'page1',
        'changes': [
          {
            op: 'replace',
            path: '/title/0/text',
            value: 'Updated Page 1',
          },
          {
            op: 'remove',
            path: '/textSections/0',
          },
        ],
      };

      assertEqualWithoutId(objectWithoutTimestamp(historyData[0]), expectedHistoryEntry);
      // @ts-expect-error - timestamp exists at runtime
      assertTimestamp(historyData[0].timestamp);
    });
  });

  describe('delete', () => {
    it('should delete existing page', async () => {
      await fileStoragePageRepository.delete('page1');
      
      const updatedFile = getMockData('pages.json');

      const expected = [
        ...mockPageData.slice(1),
      ];

      assert.deepEqual(updatedFile, expected);
    });

    it('should do nothing if page not found', async () => {
      await fileStoragePageRepository.delete('nonexistent');
      
      const updatedFile = getMockData('pages.json');

      assert.deepEqual(updatedFile, mockPageData);
    });

    it('should save the deletion in the history', async () => {
      await fileStoragePageRepository.delete('page1');

      const historyData = getMockData('history.json');

      const expectedHistoryEntry = {
        'modelType': 'Page',
        'modelId': 'page1',
        'changes': 'Delete',
      };

      assertEqualWithoutId(objectWithoutTimestamp(historyData[0]), expectedHistoryEntry);
      // @ts-expect-error - timestamp exists at runtime
      assertTimestamp(historyData[0].timestamp);
    });
  });
});
