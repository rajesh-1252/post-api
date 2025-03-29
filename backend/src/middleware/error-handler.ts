import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../logger/logger";
import { CustomAPIError } from "../errors";

const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (!(err instanceof CustomAPIError)) {
    logger.error(err);
  }

  const statusCode =
    err instanceof CustomAPIError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  const message =
    err instanceof CustomAPIError
      ? err.message
      : "Something went wrong, try again later";

  console.log(err);

  res.status(statusCode).json({ success: false, msg: message });
};

export default errorHandlerMiddleware;
