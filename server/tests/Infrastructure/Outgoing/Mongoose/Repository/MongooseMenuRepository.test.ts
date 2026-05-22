import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import MongoosePageRepository from '../../../../../src/Infrastructure/Outgoing/Mongoose/Repository/MongoosePageRepository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MongooseMenuRepository from '../../../../../src/Infrastructure/Outgoing/Mongoose/Repository/MongooseMenuRepository';
import MenuAggregate from '../../../../../src/Domain/Aggregate/MenuAggregate';
import MenuItem from '../../../../../src/Domain/ValueObject/MenuItem';
import type { IMenuRaw } from '../../../../../src/Infrastructure/Outgoing/types';

const menuId = new mongoose.Types.ObjectId();
const page1Id = new mongoose.Types.ObjectId();
const page2Id = new mongoose.Types.ObjectId();

const mockMenuData = [
  {
    _id: menuId,
    name: 'Main Menu',
    items: [
      { type: 'page', pageId: page1Id.toHexString(), items: [] },
      { type: 'subMenu', name: 'Sub Menu', items: [
        { type: 'page', pageId: page2Id.toHexString(), items: [] }
      ] },
    ],
  },
];
const mockPageData = [
  {
    _id: page1Id,
    title: [ { 'text': 'Page 1', season: 0, episode: 0 } ],
  },
  {
    _id: page2Id,
    title: [ { 'text': 'Page 2', season: 0, episode: 0 } ],
    text: [],
    properties: [],
    textSections: [],
  },
];

describe('MongoosePageRepository', () => {
  let mongo: MongoMemoryServer;
  let mongooseMenuRepository: MongooseMenuRepository;
  let mongoosePageRepository: MongoosePageRepository;

  before(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    mongoosePageRepository = new MongoosePageRepository();
    mongooseMenuRepository = new MongooseMenuRepository(
      mongoosePageRepository,
    );
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    await mongoose.connection.collection('pages').insertMany(mockPageData);
    await mongoose.connection.collection('menus').insertMany(mockMenuData);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  describe('getMenuByName', () => {
    it('should throw error if menu not found', { expectFailure: 'Menu not found' }, async () => {
      await mongooseMenuRepository.getMenuByName('nonexistent', 0, 0);
    });

    it('should return menu aggregate by Name', async () => {
      const menu = await mongooseMenuRepository.getMenuByName('Main Menu', 0, 0);

      const expected = new MenuAggregate(
        menuId.toHexString(),
        'Main Menu',
        [
          new MenuItem('page', 'Page 1', page1Id.toHexString()),
          new MenuItem('subMenu', 'Sub Menu', undefined, [
            new MenuItem('page', 'Page 2', page2Id.toHexString()),
          ]),
        ]
      );

      assert.deepEqual(menu, expected);
    });
  });

  describe('findRawByName', () => {
    it('should throw error if menu not found', { expectFailure: 'Menu not found' }, async () => {
      await mongooseMenuRepository.findRawByName('nonexistent');
    });

    it('should return raw menu data by name', async () => {
      const menu = await mongooseMenuRepository.findRawByName('Main Menu');

      const expected = { ...mockMenuData[0], _id: mockMenuData[0]._id.toHexString() };

      assert.deepEqual(menu, expected);
    });
  });

  describe('update', () => {
    it('should throw error if menu not found', { expectFailure: 'Menu not found' }, async () => {
      await mongooseMenuRepository.update('nonexistent', { _id: 'nonexistent', name: 'Updated Menu', items: [] });
    });

    it('should update menu data', async () => {
      const updatedData: IMenuRaw = {
        _id: menuId.toHexString(),
        name: 'Updated Menu',
        items: [
          { type: 'page', pageId: page1Id.toHexString() },
        ],
      };

      await mongooseMenuRepository.update(menuId.toHexString(), updatedData);

      const menu = await mongooseMenuRepository.findRawByName('Updated Menu');
      const expected = {
        ...updatedData,
        _id: menuId.toHexString(),
        items: [
          { ...updatedData.items[0], items: [] },
        ]
      };

      assert.deepEqual(menu, expected);
    });
  });
});