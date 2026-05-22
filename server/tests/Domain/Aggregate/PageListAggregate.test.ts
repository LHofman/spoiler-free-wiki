import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import PageListAggregate from '../../../src/Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../src/Domain/ValueObject/PageListItem';
import TextItemVersions from '../../../src/Domain/ValueObject/TextItemVersions';
import TextItem from '../../../src/Domain/ValueObject/TextItem';

describe('PageListAggregate', () => {
  describe('toDTO', () => {
    const pageListAggregate = new PageListAggregate([
      new PageListItem(
        'id1',
        new TextItemVersions([
          new TextItem('Standard Title', 0, 0),
          new TextItem('Spoiler Title', 1, 10),
        ]),
        false
      ),
      new PageListItem(
        'id2',
        new TextItemVersions([
          new TextItem('Spoiler List Item', 2, 7),
        ]),
        false
      ),
    ]);

    it('should find non-spoiler items with the latest non-spoiler title', () => {
      const expectedPageListItemDTOs = [
        {
          id: 'id1',
          title: 'Standard Title',
          canDelete: false,
        },
      ];

      assert.deepEqual(pageListAggregate.toDTO(), expectedPageListItemDTOs);
    });

    it('should find non-spoiler items with the latest non-spoiler title for given season and episode', () => {
      const expectedPageListItemDTOs = [
        {
          id: 'id1',
          title: 'Spoiler Title',
          canDelete: false,
        },
        {
          id: 'id2',
          title: 'Spoiler List Item',
          canDelete: false,
        },
      ];

      assert.deepEqual(pageListAggregate.toDTO(3, 13), expectedPageListItemDTOs);
    });

    it('should exclude spoiler items from lower episodes in higher seasons', () => {
      const expectedPageListItemDTOs = [
        {
          id: 'id1',
          title: 'Spoiler Title',
          canDelete: false,
        },
      ];

      assert.deepEqual(pageListAggregate.toDTO(1, 13), expectedPageListItemDTOs);
    });
  });
});