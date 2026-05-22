import fs from 'fs';
import path from 'path';
import PageAggregate from '../../../../Domain/Aggregate/PageAggregate';
import DocumentNotFoundError from '../../../../Domain/Error/DocumentNotFoundError';
import PageRepository from '../../../../Domain/Repository/PageRepository';
import PageProperty from '../../../../Domain/ValueObject/PageProperty';
import TextItem from '../../../../Domain/ValueObject/TextItem';
import TextItemVersions from '../../../../Domain/ValueObject/TextItemVersions';
import TextSection from '../../../../Domain/ValueObject/TextSection';
import PageListAggregate from '../../../../Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../../Domain/ValueObject/PageListItem';
import type { IPageRaw, ITextItemSchemaRaw } from '../../types';

const dataFilePath = path.resolve(__dirname, '../Data/pages.json');
const historyFilePath = path.resolve(__dirname, '../Data/history.json');

export default class FileStoragePageRepository implements PageRepository {
  private pages: IPageRaw[];
  private history: object[];
    
  constructor() {
    this.pages = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    this.history = JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));
  }

  generateId(): string {
    return 'mockid-' + Math.random().toString(36).substring(2, 15);
  }
  
  getList = async (): Promise<PageListAggregate> => {
    return new PageListAggregate(
      this.pages.map((page: IPageRaw) => new PageListItem(
        page._id,
        new TextItemVersions(page.title.map(this.mapTextItemToValueObject)),
        (!page.text.length && !page.properties.length && !page.textSections.length),
      )),
    );
  }

  findById = async (id: string): Promise<PageAggregate> => {
    const page = this.pages.find((page: IPageRaw) => page._id === id);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return new PageAggregate(
      page._id,
      new TextItemVersions(page.title.map(this.mapTextItemToValueObject)),
      (page.properties ?? []).map((pageProperty) => new PageProperty(
        pageProperty.property,
        this.mapTextItemVersionsToValueObject(pageProperty.value),
      )),
      page.text.map(this.mapTextItemVersionsToValueObject),
      (page.textSections ?? []).map((textSection) => new TextSection(
        this.mapTextItemVersionsToValueObject(textSection.title),
        textSection.text.map(this.mapTextItemVersionsToValueObject),
      )),
    );
  }

  private mapTextItemToValueObject = ({text, season, episode}: ITextItemSchemaRaw) =>
    new TextItem(text, season, episode);

  private mapTextItemVersionsToValueObject = (textItemVersions: ITextItemSchemaRaw[]) =>
    new TextItemVersions(textItemVersions.map(this.mapTextItemToValueObject));

  findRawById = async (id: string): Promise<IPageRaw> => {
    const page = this.pages.find((page: IPageRaw) => page._id === id);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return page;
  }
  
  getNamesByIds = async (
    ids: string[],
    season: number,
    episode: number
  ): Promise<Map<string, string | null>> => {
    const pages = this.pages.filter((page: IPageRaw) => ids.includes(page._id));
    const pageMap = new Map<string, string | null>();

    for (const page of pages) {
      const titleItemVersions = new TextItemVersions(page.title.map(this.mapTextItemToValueObject));
      const title = titleItemVersions.getSpoilerFreeText(season, episode);
      pageMap.set(page._id.toString(), title);
    }

    return pageMap;
  }

  add = async (body: {
    id: string,
    title: { text: string, season: number, episode: number }[],
  }): Promise<void> => {
    const newPageDataWithDefaults = {
      title: body.title,
      text: [],
      properties: [],
      textSections: [],
    };

    this.pages.push({ _id: body.id, ...newPageDataWithDefaults });
    this.saveToPagesFile();

    const historyEntry = {
      'id': this.generateId(),
      'modelType': 'Page',
      'modelId': body.id,
      'timestamp': new Date().toISOString(),
      'changes': [
        {
          'type': 'create',
          'data': newPageDataWithDefaults,
        }
      ]
    }

    this.history.push(historyEntry);
    this.saveToHistoryFile();
  }

  update = async (id: string, body: IPageRaw): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageRaw) => page._id === id);
    if (pageIndex === -1) {
      throw new DocumentNotFoundError('Page');
    }

    this.pages[pageIndex] = { ...this.pages[pageIndex], ...body };
    this.saveToPagesFile();

    const { _id, ...otherUpdatedData } = body;

    const historyEntry = {
      'id': this.generateId(),
      'modelType': 'Page',
      'modelId': id,
      'timestamp': new Date().toISOString(),
      'changes': [
        {
          'type': 'update',
          'data': otherUpdatedData,
        }
      ]
    }

    this.history.push(historyEntry);
    this.saveToHistoryFile();
  }

  delete = async (id: string): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageRaw) => page._id === id);
    if (pageIndex === -1) {
      return;
    }

    this.pages.splice(pageIndex, 1);
    this.saveToPagesFile();
  }

  private saveToPagesFile = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.pages, null, 2), 'utf-8');
  }
  
  private saveToHistoryFile = (): void => {
    fs.writeFileSync(historyFilePath, JSON.stringify(this.history, null, 2), 'utf-8');
  }
}