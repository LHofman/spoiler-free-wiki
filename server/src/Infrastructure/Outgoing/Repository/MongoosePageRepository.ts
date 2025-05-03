import PageDTO from '../../../Application/Port/DTO/PageDTO';
import PageAggregate from '../../../Domain/Aggregate/PageAggregate';
import DocumentNotFoundError from '../../../Domain/Error/DocumentNotFoundError';
import PageRepository from '../../../Domain/Repository/PageRepository';
import TextItem from '../../../Domain/ValueObject/TextItem';
import TextItemVersions from '../../../Domain/ValueObject/TextItemVersions';
import Page, { IPageDoc } from '../Model/Page';
import { ITextItemSchemaDoc } from '../Model/TextItemSchema';
import MongooseRepository from './MongooseRepository';

export default class MongoosePageRepository extends MongooseRepository<IPageDoc> implements PageRepository {
  public findById = async (id: string): Promise<PageAggregate> => {
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return new PageAggregate(
      page.id,
      page.title,
      page.text.map((textItemVersions: ITextItemSchemaDoc[]) => {
        return new TextItemVersions(
          textItemVersions.map((textItemVersion: ITextItemSchemaDoc) => {
            return new TextItem(
              textItemVersion.text,
              textItemVersion.season,
              textItemVersion.episode,
            )
          }),
        )
      })
    );
  }

  // Temporary to update page via postman, easier than doing it in atlas
  update = async (id: string, body: any) => {
    await Page.findByIdAndUpdate(id, body);
  }
}