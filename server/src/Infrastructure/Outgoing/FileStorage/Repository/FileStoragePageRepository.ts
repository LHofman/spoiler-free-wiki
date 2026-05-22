import fs from 'fs';
import path from 'path';
import { createPatch } from 'rfc6902';
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
import FileStorageRepository from './FileStorageRepository';

const dataFilePath = path.resolve(__dirname, '../Data/pages.json');
const historyFilePath = path.resolve(__dirname, '../Data/history.json');

export default class FileStoragePageRepository extends FileStorageRepository implements PageRepository {
  private pages: IPageRaw[];
    
  constructor() {
    super();
    this.pages = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
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
    const toUpdate = {
      _id: body.id,
      title: body.title,
      text: [],
      properties: [],
      textSections: [],
    };

    this.pages.push(toUpdate);
    this.saveToPagesFile();

    this.saveDiffInHistory('Page', body.id, {}, toUpdate);
  }

  update = async (id: string, body: IPageRaw): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageRaw) => page._id === id);
    if (pageIndex === -1) {
      throw new DocumentNotFoundError('Page');
    }

    const oldData = this.pages[pageIndex];
    const newData = { ...oldData, ...body };

    this.pages[pageIndex] = newData;
    this.saveToPagesFile();

    this.saveDiffInHistory('Page', id, oldData, newData);
  }

  delete = async (id: string): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageRaw) => page._id === id);
    if (pageIndex === -1) {
      return;
    }

    this.pages.splice(pageIndex, 1);
    this.saveToPagesFile();

    this.saveDeleteInHistory('Page', id);
  }

  private saveToPagesFile = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.pages, null, 2), 'utf-8');
  }
}