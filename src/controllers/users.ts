import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError } from '../errors';

import User from "../models/user";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then(users => res.json(users))
    .then(users => res.status(201).send(users))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  return User.findById(req.params.id)
    .then(user => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.json(user);
    })
    .then(user => res.status(201).send(user))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then(user => {
      if (!user) {
        throw new BadRequestError("Coudn't create user");
      }
      return res.json(user);
    })
    .then(user => res.status(201).send(user))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then(user => {
      if (!user) {
        throw new BadRequestError("Couldn't update user");
      }
      return res.json(user);
    })
    .then(user => res.status(201).send(user))
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => {
      if (!user) {
        throw new BadRequestError("Couldn't update user avatar");
      }
      return res.json(user);
    })
    .then(user => res.status(201).send(user))
    .catch(next);
};