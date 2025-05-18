import { TextItem } from '../types/PageTypes';

export const sortTextItemsCompareFn = (a: TextItem, b: TextItem): number => {
  if (a.season > b.season) return 1;
  if (a.season < b.season) return -1;
  if (a.episode > b.episode) return 1;
  return -1;
}