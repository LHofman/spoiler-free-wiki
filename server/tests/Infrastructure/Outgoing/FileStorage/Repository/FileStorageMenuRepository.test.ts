import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import FileStorageMenuRepository from '../../../../../src/Infrastructure/Outgoing/FileStorage/Repository/FileStorageMenuRepository';
import FileStoragePageRepository from '../../../../../src/Infrastructure/Outgoing/FileStorage/Repository/FileStoragePageRepository';
import { getMockData, mockDataFiles } from './Utils/mockDataFile';
import MenuAggregate from '../../../../../src/Domain/Aggregate/MenuAggregate';
import MenuItem from '../../../../../src/Domain/ValueObject/MenuItem';
import { assertEqualWithoutId, assertTimestamp, objectWithoutTimestamp } from './Utils/historyUtils';

const mockMenuData: object[] = [
  {
    _id: 'menu1',
    name: 'Main Menu',
    items: [
      { type: 'page', pageId: 'page1' },
      { type: 'subMenu', name: 'Sub Menu', items: [{ type: 'page', pageId: 'page2' }] },
    ],
  },
];
const mockPageData: object[] = [
  { _id: 'page1', title: [ { 'text': 'Page 1', season: 0, episode: 0 } ] },
  { _id: 'page2', title: [ { 'text': 'Page 2', season: 0, episode: 0 } ] },
];
const mockHistoryData: object[] = [];

describe('FileStorageMenuRepository', () => {
  let fileStorageMenuRepository: FileStorageMenuRepository;
  
  mockDataFiles({
    'menus.json': mockMenuData,
    'pages.json': mockPageData,
    'history.json': mockHistoryData,
  });
  
  before(() => {
    fileStorageMenuRepository = new FileStorageMenuRepository(
      new FileStoragePageRepository(),
    );
  });

  describe('getMenuByName', () => {
    it('should throw error when menu is not found', { expectFailure: 'Menu not found' }, async () => {
      await fileStorageMenuRepository.getMenuByName('Wrong Name', 0, 0);
    });

    it('should return menu with correct name', async () => {
      const menu = await fileStorageMenuRepository.getMenuByName('Main Menu', 0, 0);

      const expectedMenu = new MenuAggregate(
        'menu1',
        'Main Menu',
        [
          new MenuItem('page', 'Page 1', 'page1'),
          new MenuItem('subMenu', 'Sub Menu', undefined, [
            new MenuItem('page', 'Page 2', 'page2'),
          ]),
        ]
      );

      assert.deepEqual(menu, expectedMenu);
    });
  });

  describe('findRawMenuName', () => {
    it('should throw error when menu is not found', { expectFailure: 'Menu not found' }, async () => {
      await fileStorageMenuRepository.getMenuByName('Wrong Name', 0, 0);
    });

    it('should return correct raw menu by name', async () => {
      const menu = await fileStorageMenuRepository.findRawByName('Main Menu');
      assert.deepEqual(mockMenuData[0], menu);
    });
  });

  describe('update', () => {
    it('should throw error when menu is not found', { expectFailure: 'Menu not found' }, async () => {
      await fileStorageMenuRepository.update('wrongId', { name: 'New Name' } as any);
    });

    it('should update menu with correct data', async () => {
      const updatedData = { name: 'Updated Menu Name' };
      await fileStorageMenuRepository.update('menu1', updatedData as any);

      const expectedMenu = { ...mockMenuData[0], ...updatedData };

      const updatedFile = getMockData('menus.json')[0];

      assert.deepEqual(updatedFile, expectedMenu);
    });

    it('should save diff in history', async () => {
      const updatedData = { name: 'Updated Menu Name' };
      await fileStorageMenuRepository.update('menu1', updatedData as any);

      const historyData = getMockData('history.json');
      
      const expectedHistoryEntry = {
        'modelType': 'Menu',
        'modelId': 'menu1',
        'changes': [
          {
            op: 'replace',
            path: '/name',
            value: 'Updated Menu Name',
          },
        ],
      };

      assertEqualWithoutId(objectWithoutTimestamp(historyData[0]), expectedHistoryEntry);
      // @ts-expect-error - timestamp exists at runtime
      assertTimestamp(historyData[0].timestamp);
    });
  });
});