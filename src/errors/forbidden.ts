import WebError from './web-error';

export default class ForbiddenError extends WebError {
  readonly statusCode = 403;
}
