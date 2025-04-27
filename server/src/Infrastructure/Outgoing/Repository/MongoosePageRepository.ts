import PageDTO from '../../../Application/Port/DTO/PageDTO';
import DocumentNotFoundError from '../../../Domain/Error/DocumentNotFoundError';
import PageRepository from '../../../Domain/Repository/PageRepository';
import Page, { IPageDoc } from '../Model/Page';
import { ITextItemSchemaDoc } from '../Model/TextItemSchema';
import MongooseRepository from './MongooseRepository';

export default class MongoosePageRepository extends MongooseRepository<IPageDoc> implements PageRepository {
  public findById = async (id: string, season: number = 0, episode: number = 0): Promise<PageDTO> => {
    const pageId = this.toObjectId(id);
    const page = await Page.findById(pageId);
    if (!page) {
      throw new DocumentNotFoundError('Page');
    }

    return this.mapModelToDTO(page, season, episode);
  }

  private mapModelToDTO(page: IPageDoc, season: number = 0, episode: number = 0): PageDTO {
    const latestText: string[] = [];
    page.text.forEach((textVersions: ITextItemSchemaDoc[]) => {
      textVersions.sort((textVersion1, textVersion2) => {
        if (textVersion1.season !== textVersion2.season)
          return Math.sign(textVersion2.season - textVersion1.season);

        return Math.sign(textVersion2.episode - textVersion1.episode);
      });

      for (const textVersion of textVersions) {
        if (
          textVersion.season < season
          || (textVersion.season === season && textVersion.episode <= episode)
        ) {
          latestText.push(textVersion.text);
          break;
        }
      }
    });

    return {
      id: page._id,
      title: page.title,
      text: latestText,
    };
  }

  // Temporary to update page via postman, easier than doing it in atlas
  update = async (id: string, body: any) => {
    await Page.findByIdAndUpdate(id, body);
  }
}