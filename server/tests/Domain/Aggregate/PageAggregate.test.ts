import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import PageListAggregate from '../../../src/Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../src/Domain/ValueObject/PageListItem';
import TextItemVersions from '../../../src/Domain/ValueObject/TextItemVersions';
import TextItem from '../../../src/Domain/ValueObject/TextItem';
import PageAggregate from '../../../src/Domain/Aggregate/PageAggregate';
import PageProperty from '../../../src/Domain/ValueObject/PageProperty';
import TextSection from '../../../src/Domain/ValueObject/TextSection';

describe('PageAggregate', () => {
  describe('toDTO', () => {
    const pageAgggregate = new PageAggregate(
      'id1',
      new TextItemVersions([
        new TextItem('Standard Title', 0, 0),
        new TextItem('Spoiler Title', 1, 10),
      ]),
      [
        new PageProperty(
          'Property 1',
          new TextItemVersions([
            new TextItem('Standard Property Value', 0, 0),
            new TextItem('Spoiler Property Value', 1, 10),
          ]),
        ),
        new PageProperty(
          'Property 2',
          new TextItemVersions([
            new TextItem('Spoiler Property', 2, 5),
          ]),
        ),
      ],
      [
        new TextItemVersions([
          new TextItem('Standard Text 1', 0, 0),
          new TextItem('Spoiler Text 1', 1, 10),
        ]),
        new TextItemVersions([
          new TextItem('Spoiler Text 2', 2, 5),
        ]),
      ],
      [
        new TextSection(
          new TextItemVersions([
            new TextItem('Standard Section 1', 0, 0),
            new TextItem('Spoiler Section 1', 1, 10),
          ]),
          [
            new TextItemVersions([
              new TextItem('Standard Section Text 1', 0, 0),
              new TextItem('Spoiler Section Text 1', 1, 10),
            ]),
             new TextItemVersions([
              new TextItem('Spoiler Section Text 2', 2, 5),
            ]),
          ]
        ),
        new TextSection(
          new TextItemVersions([
            new TextItem('Spoiler Section 2', 1, 10),
          ]),
          [
            new TextItemVersions([
              new TextItem('Spoiler Section Text 2', 1, 10),
            ]),
          ]
        ),
      ]
    );
    
    it('should find non-spoiler text', () => {
      const expectedPageDTO = {
        _id: 'id1',
        title: 'Standard Title',
        properties: [
          {
            property: 'Property 1',
            value: 'Standard Property Value',
          },
        ],
        text: ['Standard Text 1'],
        textSections: [
          {
            title: 'Standard Section 1',
            text: ['Standard Section Text 1'],
          },
        ],
      };

      assert.deepEqual(pageAgggregate.toDTO(), expectedPageDTO);
    });

    it('should find spoiler text for given season and episode', () => {
      const expectedPageDTO = {
        _id: 'id1',
        title: 'Spoiler Title',
        properties: [
          {
            property: 'Property 1',
            value: 'Spoiler Property Value',
          },
          {
            property: 'Property 2',
            value: 'Spoiler Property',
          },
        ],
        text: ['Spoiler Text 1', 'Spoiler Text 2'],
        textSections: [
          {
            title: 'Spoiler Section 1',
            text: ['Spoiler Section Text 1', 'Spoiler Section Text 2'],
          },
          {
            title: 'Spoiler Section 2',
            text: ['Spoiler Section Text 2'],
          },
        ],
      };

      assert.deepEqual(pageAgggregate.toDTO(3, 13), expectedPageDTO);
    });

    it('should exclude spoiler text from lower episodes in higher seasons', () => {
      const expectedPageDTO = {
        _id: 'id1',
        title: 'Spoiler Title',
        properties: [
          {
            property: 'Property 1',
            value: 'Spoiler Property Value',
          },
        ],
        text: ['Spoiler Text 1'],
        textSections: [
          {
            title: 'Spoiler Section 1',
            text: ['Spoiler Section Text 1'],
          },
          {
            title: 'Spoiler Section 2',
            text: ['Spoiler Section Text 2'],
          },
        ],
      };

      assert.deepEqual(pageAgggregate.toDTO(1, 13), expectedPageDTO);
    });
  });
});