import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import PageListAggregate from '../../../../../src/Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../../../src/Domain/ValueObject/PageListItem';
import TextItemVersions from '../../../../../src/Domain/ValueObject/TextItemVersions';
import TextItem from '../../../../../src/Domain/ValueObject/TextItem';
import PageAggregate from '../../../../../src/Domain/Aggregate/PageAggregate';
import PageProperty from '../../../../../src/Domain/ValueObject/PageProperty';
import TextSection from '../../../../../src/Domain/ValueObject/TextSection';
import MongoosePageRepository from '../../../../../src/Infrastructure/Outgoing/Mongoose/Repository/MongoosePageRepository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mockPageData = [
  {
    _id: new mongoose.Types.ObjectId(),
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
    _id: new mongoose.Types.ObjectId(),
    title: [ { 'text': 'Page 2', season: 0, episode: 0 } ],
    text: [],
    properties: [],
    textSections: [],
  },
];

describe('MongoosePageRepository', () => {
  let mongo: MongoMemoryServer;
  let mongoosePageRepository: MongoosePageRepository;

  before(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    mongoosePageRepository = new MongoosePageRepository();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    await mongoose.connection.collection('pages').insertMany(mockPageData);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = mongoosePageRepository.generateId();
      const id2 = mongoosePageRepository.generateId();
      assert.notEqual(id1, id2);
    });
  });

  describe('getList', () => {
    it('should return list of pages', async () => {
      const pageList = await mongoosePageRepository.getList();

      const expected = new PageListAggregate([
        new PageListItem(
          mockPageData[0]._id.toString(),
          new TextItemVersions([new TextItem('Page 1', 0, 0)]),
          false,
        ),
        new PageListItem(
          mockPageData[1]._id.toString(),
          new TextItemVersions([new TextItem('Page 2', 0, 0)]),
          true, 
        ),
      ]);
      
      assert.deepEqual(pageList, expected);
    });
  });

  describe('findById', () => {
    it('should throw error if page not found', { expectFailure: 'Page not found' }, async () => {
      await mongoosePageRepository.findById('nonexistent');
    });

    it('should return page aggregate by ID', async () => {
      const page = await mongoosePageRepository.findById(mockPageData[0]._id.toString());

      const expected = new PageAggregate(
        mockPageData[0]._id.toString(),
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
      await mongoosePageRepository.findRawById('nonexistent');
    });

    it('should return raw page document by ID', async () => {
      const pageDoc = await mongoosePageRepository.findRawById(mockPageData[0]._id.toString());

      const expected = { ...mockPageData[0], _id: mockPageData[0]._id.toHexString() };

      assert.deepEqual(pageDoc, expected);
    });
  });

  describe('getNamesByIds', () => {
    it('should return map of page IDs to names', async () => {
      const namesMap = await mongoosePageRepository.getNamesByIds([mockPageData[0]._id.toString(), mockPageData[1]._id.toString()], 0, 0);
      const expected = new Map<string, string | null>([
        [mockPageData[0]._id.toString(), 'Page 1'],
        [mockPageData[1]._id.toString(), 'Page 2'],
      ]);
      assert.deepEqual(namesMap, expected);
    });
  });

  describe('add', () => {
    it('should add new page', async () => {
      const newPageData = {
        id: mongoosePageRepository.generateId(),
        title: [ { 'text': 'Page 3', season: 0, episode: 0 } ],
      };
      await mongoosePageRepository.add(newPageData);

      const newData = await mongoosePageRepository.findRawById(newPageData.id);

      const expected = {
        _id: newPageData.id,
        title: newPageData.title,
        text: [],
        properties: [],
        textSections: []
      };

      assert.deepEqual(newData, expected);
    });

    it('should save the new page in the history', async () => {
      const newPageId = mongoosePageRepository.generateId();

      const newPageData = {
        id: newPageId,
        title: [ { 'text': 'Page 3', season: 0, episode: 0 } ],
      };
      await mongoosePageRepository.add(newPageData);

      const actual = await mongoose.connection.collection('histories').find({}).toArray();

      const expected = {
        'modelType': 'Page',
        'modelId': 'page3',
        'changes': [
          {
            op: 'add',
            path: '/_id',
            value: new mongoose.Types.ObjectId(newPageId),
          },
          {
            op: 'add',
            path: '/title',
            value: [ { text: 'Page 3', season: 0, episode: 0 } ],
          },
        ],
      };

      assert.deepEqual(actual[0].modelType, 'Page');
      assert.deepEqual(actual[0].modelId, new mongoose.Types.ObjectId(newPageId));
      assert.deepEqual(actual[0].changes, expected.changes);
    });
  });

  describe('update', () => {
    it('should throw error if page not found', { expectFailure: 'Page not found' }, async () => {
      await mongoosePageRepository.update('nonexistent', { _id: 'nonexistent', title: [], text: [], properties: [], textSections: [] });
    });

    it('should update existing page', async () => {
      const updatedPageData = { _id: mockPageData[0]._id.toString(), title: [ { 'text': 'Updated Page 1', season: 0, episode: 0 } ], text: [], properties: [], textSections: [] };
      await mongoosePageRepository.update(mockPageData[0]._id.toString(), updatedPageData);

      const newData = await mongoosePageRepository.findRawById(mockPageData[0]._id.toString());

      const expected = {
        _id: updatedPageData._id,
        title: updatedPageData.title,
        text: [],
        properties: [],
        textSections: []
      };

      assert.deepEqual(newData, expected);
    });

    it('should save the update in the history', async () => {
      const pageId = mockPageData[0]._id.toString();
      const updatedPageData = {
        _id: pageId,
        title: [ { 'text': 'Updated Page 1', season: 0, episode: 0 } ],
        text: [],
        properties: [],
        textSections: []
      };
      await mongoosePageRepository.update(pageId, updatedPageData);

      const actual = await mongoose.connection.collection('histories').find({}).toArray();

      const expected = {
        'modelType': 'Page',
        'modelId': pageId,
        'changes': [
          {
            op: 'replace',
            path: '/title/0/text',
            value: 'Updated Page 1',
          },
          {
            op: 'remove',
            path: '/text/0',
          },
          {
            op: 'remove',
            path: '/properties/0',
          },
          {
            op: 'remove',
            path: '/properties/0',
          },
          {
            op: 'remove',
            path: '/textSections/0',
          },
        ],
      };

      assert.deepEqual(actual[0].modelType, 'Page');
      assert.deepEqual(actual[0].modelId, new mongoose.Types.ObjectId(pageId));
      assert.deepEqual(actual[0].changes, expected.changes);
    });
  });

  describe('delete', () => {
    it('should delete existing page', async () => {
      await mongoosePageRepository.delete(mockPageData[0]._id.toString());
      
      try {
        await mongoosePageRepository.findRawById(mockPageData[0]._id.toString());
        assert.fail('Expected error not thrown');
      } catch (error: any) {
        assert.equal(error.message, 'Page not found');
      }
    });

    it('should do nothing if page not found', async () => {
      const anotherId = mongoosePageRepository.generateId();
      await mongoosePageRepository.delete(anotherId);

      try {
        await mongoosePageRepository.findRawById(anotherId);
        assert.fail('Expected error not thrown');
      } catch (error: any) {
        assert.equal(error.message, 'Page not found');
      }
    });

    it('should save the deletion in the history', async () => {
      const pageId = mockPageData[0]._id.toString();
      await mongoosePageRepository.delete(pageId);

      const actual = await mongoose.connection.collection('histories').find({}).toArray();

      const expected = {
        'modelType': 'Page',
        'modelId': pageId,
        'changes': 'Delete',
      };

      assert.deepEqual(actual[0].modelType, 'Page');
      assert.deepEqual(actual[0].modelId, new mongoose.Types.ObjectId(pageId));
      assert.deepEqual(actual[0].changes, expected.changes);
    });
  });
});