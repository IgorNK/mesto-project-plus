export abstract class WebError extends Error {
  abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends WebError {
  readonly statusCode = 404;
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends WebError {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends WebError {
  readonly statusCode = 403;
  constructor(message: string) {
    super(message);
  }
}