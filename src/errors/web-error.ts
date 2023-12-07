export default abstract class WebError extends Error {
  abstract readonly statusCode: number;
}
