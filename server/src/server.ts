import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import Page from './models/Page';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri: string = process.env.MONGODB_URI || '';

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database');
  } catch(error) {
    console.error(error);
  }
})();

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

app.get('/api/pages', async (_req: Request, res: Response) => {
  const pages = await Page.find();
  res.json(pages);
});

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});