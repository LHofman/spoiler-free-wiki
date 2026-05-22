import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import MenuAggregate from '../../../src/Domain/Aggregate/MenuAggregate';
import MenuItem from '../../../src/Domain/ValueObject/MenuItem';

describe('MenuAggregate', () => {
  describe('toDTO', () => {
    it('should convert MenuAggregate to MenuDTO correctly', () => {
      const menuAggregate = new MenuAggregate('1', 'Main Menu', [
        new MenuItem('page', 'Page 1', 'page-1'),
        new MenuItem('subMenu', 'Submenu 1', undefined, [
          new MenuItem('page', 'Page 2', 'page-2'),
        ]),
      ]);

      const expectedDTO = {
        id: '1',
        name: 'Main Menu',
        items: [
          { type: 'page', name: 'Page 1', pageId: 'page-1' },
          { type: 'subMenu', name: 'Submenu 1', items: [
            { type: 'page', name: 'Page 2', pageId: 'page-2' },
          ]},
        ],
      };

      assert.deepEqual(menuAggregate.toDTO(), expectedDTO);
    });
  });
});