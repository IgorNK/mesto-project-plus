import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError, ForbiddenError } from "../errors";

import Card from "../models/card";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then(cards => res.json(cards))
    .then(cards => res.status(201).send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  if (!name || !link) {
    throw new BadRequestError("Bad request, couldn't create card");
  }
  if (!ownerId) {
    throw new ForbiddenError("Forbidden, you must be authorized");
  }

  return Card.create({ name, link, owner: ownerId })
    .then(card => res.json(card))
    .then(card => res.status(201).send(card))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!id) {
    throw new BadRequestError("Bad request, couldn't delete card");
  }
  if (!userId) {
    throw new ForbiddenError("Forbidden, you must be authorized");
  }

  return Card.deleteOne({ _id: id, owner: userId })
    .then(() => res.status(204).send())
    .catch(next);
}

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      return res.json();
    })
    .then(() => res.status(204).send())
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
    })
    .then(() => res.status(204).send())
    .catch(next);
};