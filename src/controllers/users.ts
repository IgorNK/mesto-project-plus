import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/user';
import { passphrase } from '../app';

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

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  if (!_id) {
    next(new UnauthorizedError('You must be authorized'));
  }
  
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.status(201).json(user);
    })
    .catch(next);
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  if (name && !validator.isAlphanumeric(name) ||
     about && !validator.isAlphanumeric(about) ||
     avatar && !validator.isURL(avatar) ||
     !validator.isEmail(email) || 
     !validator.isStrongPassword(password)) 
  {
      return next(new BadRequestError('Bad request. Invalid data.'));
  }

  return bcrypt.hash(password, 8)
    .then((password) => User.create({ name, about, avatar, email, password }))
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError("Bad request. Couldn't create user."));
        return;
      }
      if (err.code === 11000) {
        next(new UnauthorizedError('Email already exists.'));
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotFoundError('Password is incorrect');
          }
          const token = jwt.sign({ _id: user._id }, passphrase, { expiresIn: '7d' });
          res.cookie('jwt', token, { maxAge: 3600 * 24 * 7, httpOnly: true });
        });
    })
    .catch(next);
}

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
