import mongoose from 'mongoose';
import PageRepository from '../../Domain/Repository/PageRepository';

interface AddPageProps {
  id: string,
  title: {
    text: string,
    season: number,
    episode: number,
  };
}

export default class AddPage {
  constructor(
    private pageRepository: PageRepository,
  ) {}

  add = async (props: AddPageProps): Promise<void> => {
    if (props.title.text.trim() === '') throw new Error('Page title cannot be empty');

    await this.pageRepository.add({ id: props.id, title: [props.title] });
  }
}
