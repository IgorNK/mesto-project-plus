import WebError from './web-error';

export default class UnauthorizedError extends WebError {
  readonly statusCode = 401;
}
