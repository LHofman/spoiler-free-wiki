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
import type { IPageDoc, ITextItemSchemaDoc } from '../../types';

const dataFilePath = path.resolve(__dirname, '../Data/pages.json');

export default class FileStoragePageRepository implements PageRepository {
  private pages: IPageDoc[];
    
  constructor() {
    this.pages = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  }

  generateId(): string {
    return 'mockid-' + Math.random().toString(36).substring(2, 15);
  }
  
  getList = async (): Promise<PageListAggregate> => {
    return new PageListAggregate(
      this.pages.map((page: IPageDoc) => new PageListItem(
        page._id,
        new TextItemVersions(page.title.map(this.mapTextItemToValueObject)),
        (!page.text.length && !page.properties.length && !page.textSections.length),
      )),
    );
  }

  findById = async (id: string): Promise<PageAggregate> => {
    const page = this.pages.find((page: IPageDoc) => page._id === id);
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

  private mapTextItemToValueObject = ({text, season, episode}: ITextItemSchemaDoc) =>
    new TextItem(text, season, episode);

  private mapTextItemVersionsToValueObject = (textItemVersions: ITextItemSchemaDoc[]) =>
    new TextItemVersions(textItemVersions.map(this.mapTextItemToValueObject));

  findRawById = async (id: string): Promise<IPageDoc> => {
    const page = this.pages.find((page: IPageDoc) => page._id === id);
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
    const pages = this.pages.filter((page: IPageDoc) => ids.includes(page._id));
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
    this.pages.push({ _id: body.id, title: body.title, text: [], properties: [], textSections: [] });
    this.saveToFile();
  }

  update = async (id: string, body: IPageDoc): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageDoc) => page._id === id);
    if (pageIndex === -1) {
      throw new DocumentNotFoundError('Page');
    }

    this.pages[pageIndex] = { ...this.pages[pageIndex], ...body };
    this.saveToFile();
  }

  delete = async (id: string): Promise<void> => {
    const pageIndex = this.pages.findIndex((page: IPageDoc) => page._id === id);
    if (pageIndex === -1) {
      throw new DocumentNotFoundError('Page');
    }

    this.pages.splice(pageIndex, 1);
    this.saveToFile();
  }

  private saveToFile = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.pages, null, 2), 'utf-8');
  }
}