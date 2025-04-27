import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import pagesRoutes from './Infrastructure/Incoming/Route/pages';

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

app.use('/api/pages', pagesRoutes);

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});