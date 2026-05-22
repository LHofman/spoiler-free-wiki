import mongoose from 'mongoose';
import PageAggregate from '../../../../Domain/Aggregate/PageAggregate';
import DocumentNotFoundError from '../../../../Domain/Error/DocumentNotFoundError';
import PageRepository from '../../../../Domain/Repository/PageRepository';
import PageProperty from '../../../../Domain/ValueObject/PageProperty';
import TextItem from '../../../../Domain/ValueObject/TextItem';
import TextItemVersions from '../../../../Domain/ValueObject/TextItemVersions';
import TextSection from '../../../../Domain/ValueObject/TextSection';
import Page, { IPageDoc } from '../Model/Page';
import { ITextItemSchemaDoc } from '../Model/TextItemSchema';
import MongooseRepository from './MongooseRepository';
import PageListAggregate from '../../../../Domain/Aggregate/PageListAggregate';
import PageListItem from '../../../../Domain/ValueObject/PageListItem';
import type { IPageRaw } from '../../types';

export default class MongoosePageRepository extends MongooseRepository<IPageDoc> implements PageRepository {
  generateId(): string {
    return new mongoose.Types.ObjectId().toHexString();
  }

  getList = async (): Promise<PageListAggregate> => {
    const pages = await Page.find();

    return new PageListAggregate(
      pages.map((page: IPageDoc) => new PageListItem(
        page._id.toHexString(),
        new TextItemVersions(page.title.map(this.mapTextItemToValueObject)),
        (!page.text.length && !page.properties.length && !page.textSections.length),
      )),
    );
  }

  findById = async (id: string): Promise<PageAggregate> => {
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return new PageAggregate(
      page.id,
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

  findRawById = async (id: string): Promise<IPageRaw> => {
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    const pageObject = page.toObject();

    return {
      _id: pageObject._id.toHexString(),
      title: pageObject.title,
      text: pageObject.text,
      properties: pageObject.properties,
      textSections: pageObject.textSections
    };
  }
  
  getNamesByIds = async (
    ids: string[],
    season: number,
    episode: number
  ): Promise<Map<string, string | null>> => {
    const pages = await Page.find({ _id: { $in: ids } });
    const pageMap = new Map<string, string | null>();

    for (const page of pages) {
      const titleItemVersions = new TextItemVersions(page.title.map(this.mapTextItemToValueObject));
      const title = titleItemVersions.getSpoilerFreeText(season, episode);
      pageMap.set(page._id.toHexString(), title);
    }

    return pageMap;
  }

  add = async (body: {
    id: string,
    title: { text: string, season: number, episode: number }[],
  }): Promise<void> => {
    const { id, title } = body;
    await Page.insertOne({ _id: this.toObjectId(id), title });
  }

  update = async (id: string, body: IPageRaw): Promise<void> => {
    await Page.findByIdAndUpdate(this.toObjectId(id), body);
  }

  delete = async (id: string): Promise<void> => {
    await Page.findByIdAndDelete(this.toObjectId(id));
  }
}