import express, { Request, Response } from 'express';
import PageRepository from '../../../Domain/Repository/PageRepository';
import MongoosePageRepository from '../../Outgoing/Repository/MongoosePageRepository';

const router = express.Router();

interface ProgressParams {
  season?: string;
  episode?: string;
}
interface GetByIdparams extends ProgressParams {
  id: string;
}
router.get('/:id{/:season}{/:episode}', async (req: Request<GetByIdparams>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const pageAggregate = await pageRepository.findById(req.params.id);
    const pageDTO = pageAggregate.toDTO(Number(req.params.season), Number(req.params.episode));
    res.json(pageDTO);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Temporary to update page via postman, easier than doing it in atlas
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pageRepository = new MongoosePageRepository();
    await pageRepository.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
