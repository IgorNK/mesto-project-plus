import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors';

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
  if (!name || !about || !avatar) {
    throw new BadRequestError("Bad request, couldn't create user.");
  }

  return User.create({ name, about, avatar })
    .then(user => res.json(user))
    .then(user => res.status(201).send(user))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (!name || !about) {
    throw new BadRequestError("Bad request, couldn't update user");
  }
  if (!userId) {
    throw new ForbiddenError("Forbidden, you must be authorized");
  }

  return User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then(user => res.json(user))
    .then(user => res.status(201).send(user))
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  if (!avatar) {
    throw new BadRequestError("Bad request, couldn't update avatar");
  }
  if (!userId) {
    throw new ForbiddenError("Forbidden, you must be authorized");
  }

  return User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => res.json(user))
    .then(user => res.status(201).send(user))
    .catch(next);
};