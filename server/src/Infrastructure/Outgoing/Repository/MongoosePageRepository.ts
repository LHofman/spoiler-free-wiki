import mongoose from 'mongoose';
import PageList from '../../../Application/Port/DTO/PageList';
import PageAggregate from '../../../Domain/Aggregate/PageAggregate';
import DocumentNotFoundError from '../../../Domain/Error/DocumentNotFoundError';
import PageRepository from '../../../Domain/Repository/PageRepository';
import PageProperty from '../../../Domain/ValueObject/PageProperty';
import TextItem from '../../../Domain/ValueObject/TextItem';
import TextItemVersions from '../../../Domain/ValueObject/TextItemVersions';
import TextSection from '../../../Domain/ValueObject/TextSection';
import Page, { IPageDoc } from '../Model/Page';
import { ITextItemSchemaDoc } from '../Model/TextItemSchema';
import MongooseRepository from './MongooseRepository';

export default class MongoosePageRepository extends MongooseRepository<IPageDoc> implements PageRepository {
  getList = async (): Promise<PageList> => {
    const pages = await Page.find();

    return pages.map((page: IPageDoc) => ({
      _id: page._id,
      title: page.title,
      canDelete: (!page.text.length && !page.properties.length && !page.textSections.length),
    }));
  }

  findById = async (id: string): Promise<PageAggregate> => {
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return new PageAggregate(
      page.id,
      page.title,
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
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return page;
  }

  add = async (body: { _id: mongoose.Types.ObjectId, title: string }): Promise<void> => {
    await Page.insertOne(body);
  }

  update = async (id: string, body: IPageDoc): Promise<void> => {
    await Page.findByIdAndUpdate(id, body);
  }

  delete = async (id: string): Promise<void> => {
    await Page.findByIdAndDelete(id);
  }
}