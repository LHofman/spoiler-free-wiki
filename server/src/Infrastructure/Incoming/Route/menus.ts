import express, { Request, Response } from 'express';
import MenuRepository from '../../../Domain/Repository/MenuRepository';
import MongooseMenuRepository from '../../Outgoing/Repository/MongooseMenuRepository';
import PageRepository from '../../../Domain/Repository/PageRepository';
import MongoosePageRepository from '../../Outgoing/Repository/MongoosePageRepository';

const router = express.Router();

router.get('/raw/:name', async (req: Request<{ name: string }>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const menuRepository: MenuRepository = new MongooseMenuRepository(pageRepository);
    const menuRaw = await menuRepository.findRawByName(req.params.name);
    res.json(menuRaw);
  } catch (error) {
    res.status(400).json({ error });
  }
});

interface ProgressParams {
  season?: string;
  episode?: string;
}
interface GetByNameparams extends ProgressParams {
  name: string;
}
router.get('/:name{/:season}{/:episode}', async (req: Request<GetByNameparams>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const menuRepository: MenuRepository = new MongooseMenuRepository(pageRepository);
    
    const { season, episode } = req.params;
    const menuAggregate = await menuRepository.getMenuByName(
      req.params.name,
      season ? Number(req.params.season) : 0,
      episode ? Number(req.params.episode) : 0
    );
    
    res.json(menuAggregate.toDTO());
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pageRepository: PageRepository = new MongoosePageRepository();
    const menuRepository: MenuRepository = new MongooseMenuRepository(pageRepository);
    await menuRepository.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.use((req, res) => {
  res.status(404).json({ error: 'Menus route not matched', url: req.originalUrl });
});

export default router;
