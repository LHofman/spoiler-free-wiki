import TextItem from './TextItem';

export default class TextItemVersions {
  constructor(
    private textVersions: TextItem[],
  ) {
    this.textVersions = textVersions.sort((textVersion1: TextItem, textVersion2: TextItem) => {
      if (textVersion1.season !== textVersion2.season)
        return Math.sign(textVersion2.season - textVersion1.season);

      return Math.sign(textVersion2.episode - textVersion1.episode);
    });
  }
  
  getSpoilerFreeText(season: number, episode: number): string|null {
    for (const textVersion of this.textVersions) {
      if (
        textVersion.season < season
        || (textVersion.season === season && textVersion.episode <= episode)
      ) {
        return textVersion.text;
      }
    }

    return null;
  }
}