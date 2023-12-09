import { Request, Response, NextFunction } from "express";
import { NotFoundError, BadRequestError } from "../errors";

import Card from "../models/card";

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.status(201).json(cards))
    .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, couldn't create card"));
        return;
      }
      next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user._id;

  return Card.deleteOne({ _id: id, owner: userId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      return res.status(200).send({ message: "Delete sucessful" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, couldn't delete card"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, couldn't delete card"));
        return;
      }
      next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  console.log("liking a card:");
  console.log(req.params);
  console.log("by user");
  console.log(req.user);

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      return res.status(200).json(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request. Couldn't like a card."));
        return;
      }
      next(err);
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found");
      }
      return res.status(200).json({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request. Couldn't dislike a card."));
        return;
      }
      next(err);
    });
