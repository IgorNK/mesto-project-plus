import WebError from './web-error';

export default class BadRequestError extends WebError {
  readonly statusCode = 400;
}
