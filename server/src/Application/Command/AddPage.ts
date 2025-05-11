import mongoose from 'mongoose';
import PageRepository from '../../Domain/Repository/PageRepository';

interface AddPageProps {
  _id: mongoose.Types.ObjectId,
  title: string;
}

export default class AddPage {
  constructor(
    private pageRepository: PageRepository,
  ) {}

  add = async (props: AddPageProps): Promise<void> => {
    if (props.title.trim() === '') throw new Error('Page title cannot be empty');

    await this.pageRepository.add(props);
  }
}
