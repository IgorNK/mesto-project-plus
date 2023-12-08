import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { passphrase } from '../app';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, passphrase);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Invalid token' });
  }

  req.user = payload;

  next();
}