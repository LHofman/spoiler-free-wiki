import express, { Request, Response } from 'express';
import PageRepository from '../../../Domain/Repository/PageRepository';
import MongoosePageRepository from '../../Outgoing/Repository/MongoosePageRepository';
import AddPage from '../../../Application/Command/AddPage';
import mongoose from 'mongoose';
import PageListAggregate from '../../../Domain/Aggregate/PageListAggregate';

const router = express.Router();

router.get('/list{/:season}{/:episode}', async (req: Request<ProgressParams>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const pageListAggregate = await pageRepository.getList();
    
    const { season, episode } = req.params;
    res.json(pageListAggregate.toDTO(
      season ? Number(req.params.season) : 0,
      episode ? Number(req.params.episode) : 0
    ));
  } catch (error) {
    res.status(400).json({ error });
  }
});

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

interface TextItemParams {
  text: string;
  season: number;
  episode: number;
}
router.post('/', async (req: Request<TextItemParams>, res: Response) => {
  try {
    const newPage = {
      _id: new mongoose.Types.ObjectId(),
      title: { ...req.body },
    };

    const pageRepository = new MongoosePageRepository();
    const addPageservice = new AddPage(pageRepository);
    await addPageservice.add(newPage);

    res.json({ _id: newPage._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pageRepository = new MongoosePageRepository();
    await pageRepository.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pageRepository = new MongoosePageRepository();
    await pageRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
