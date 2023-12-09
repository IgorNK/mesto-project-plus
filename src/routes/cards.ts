import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

export const routerCards = Router();

routerCards.get("/cards", getCards);

export const routerCardsProtected = Router();

routerCardsProtected.post("/cards", createCard);
routerCardsProtected.delete("/cards/:id", deleteCard);
routerCardsProtected.put("/cards/:cardId/likes", likeCard);
routerCardsProtected.delete("/cards/:cardId/likes", dislikeCard);
