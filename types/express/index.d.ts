declare namespace Express {
  interface Request {
    user: string | JwtPayload;
  }
}