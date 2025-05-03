import express, { Request, Response } from 'express';
import PageRepository from '../../../Domain/Repository/PageRepository';
import MongoosePageRepository from '../../Outgoing/Repository/MongoosePageRepository';

const router = express.Router();

router.get('/raw/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const pageRaw = await pageRepository.findRawById(req.params.id);
    res.json(pageRaw);
  } catch (error) {
    res.status(400).json({ error });
  }
});

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

    const { season, episode } = req.params;
    const pageDTO = pageAggregate.toDTO(
      season ? Number(req.params.season) : 0,
      episode ? Number(req.params.episode) : 0
    );
    res.json(pageDTO);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Temporary to update page via postman, easier than doing it in atlas
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  console.log('hi');
  try {
    const pageRepository = new MongoosePageRepository();
    await pageRepository.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
