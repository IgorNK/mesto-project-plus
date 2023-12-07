import WebError from './web-error';

export default class NotFoundError extends WebError {
  readonly statusCode = 404;
}
