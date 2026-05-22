import express, { Request, Response } from 'express';
import PageRepository, { getPageRepository } from '../../../Domain/Repository/PageRepository';
import AddPage from '../../../Application/Command/AddPage';

const router = express.Router();

const pageRepository: PageRepository = getPageRepository();

router.get('/list{/:season}{/:episode}', async (req: Request<ProgressParams>, res: Response) => {
  try {
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
      id: pageRepository.generateId(),
      title: { ...req.body },
    };

    const addPageservice = new AddPage(pageRepository);
    await addPageservice.add(newPage);

    res.json({ _id: newPage.id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    await pageRepository.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    await pageRepository.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
