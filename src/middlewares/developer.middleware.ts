import { QueryResult } from "typeorm";
import { client } from "../database";
import { NextFunction, Request, Response } from "express";
import {
  checkDeveloperExists,
  checkDeveloperInfo,
  checkPreferredOS,
  getDeveloperByEmail,
} from "../services/developerService";
import { AppError } from "../errors/AppError";

export const checkEmailExistsMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const developer = await getDeveloperByEmail(email);

  if (developer.rowCount > 0) {
    throw new AppError("Email already exists.", 409);
  }

  return next();
};

export const checkDeveloperExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;

  const developerExists = await checkDeveloperExists(Number(id));

  if (developerExists.rowCount === 0) {
    throw new AppError("Developer not found.", 404);
  }

  return next();
};

export const checkCreateDeveloperInfoMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const developerId = Number(req.params.id);
  
  await checkDeveloperInfo(developerId);

  return next();
};
