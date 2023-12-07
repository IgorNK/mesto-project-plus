import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { WebError, NotFoundError } from './errors';
import cardsRouter from './routes/cards';
import usersRouter from './routes/users';

const { PORT = 3000 } = process.env;

const server = express();
const jsonParser = bodyParser.json();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

 const uri = 'mongodb+srv://mestouser:mestouserpwd@mesto.kmtll2w.mongodb.net/mestodb?retryWrites=true&w=majority';
//const localUri = 'mongodb://localhost:27017/mestodb';

mongoose.connect(uri);

server.use(limiter);
server.use(helmet());
server.use(jsonParser);

server.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6571872aeb7aa758b3ab4e59',
  };

  next();
});

server.use('/', cardsRouter);
server.use('/', usersRouter);
server.use(() => {
  throw new NotFoundError('Page not found');
});

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  const { message } = err;
  if (err instanceof WebError) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
  next();
});

server.listen(PORT);
