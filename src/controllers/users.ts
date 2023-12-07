import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError } from '../errors';

import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(201).json(users))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return res.status(201).json(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError("Bad request. Couldn't get user."));
      return;
    }
    next(err);
  });

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError("Bad request. Couldn't create user."));
        return;
      }
      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError("Bad request. Couldn't update user."));
        return;
      }
      next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError("Bad request. Couldn't update avatar."));
        return;
      }
      next(err);
    });
};
