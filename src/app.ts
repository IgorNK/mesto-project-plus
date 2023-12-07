import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { WebError } from "./errors";
import cardsRouter from "./routes/cards";
import usersRouter from "./routes/users";

const { PORT = 3000, BASE_PATH } = process.env;

const server = express();

const uri = "mongodb+srv://mestouser:mestouserpwd@mesto.kmtll2w.mongodb.net/?retryWrites=true&w=majority";
const localUri = "mongodb://localhost:27017/mestodb";

mongoose.connect(uri);

server.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "5f446f2e1c71888e2233621e",
  };

  next();
});

server.use('/', cardsRouter);
server.use('/', usersRouter);

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  const message = err.message;
  if (err instanceof WebError) {
    statusCode = err.statusCode;     
  }
  
  res
  .status(statusCode)
  .send({
    message: statusCode === 500
      ? "Internal server error"
      : message,
  }); 
});

server.listen(PORT, () => {
  console.log('Server link: ');
  console.log(BASE_PATH);
});