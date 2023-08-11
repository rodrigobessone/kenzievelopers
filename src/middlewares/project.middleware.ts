import { Request, Response, NextFunction } from 'express';
import { checkDeveloperExists } from '../services/developerService'; // Importa a função do service
import { checkProjectExists } from '../services/projectService';
import { AppError } from '../errors/AppError';


export const checkUpdateProjectMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.id);
    const { developerId } = req.body;
    const devExists = await checkDeveloperExists(developerId);
    const projectExists = await checkProjectExists(projectId);
    if(projectExists.rowCount === 0) {
      throw new AppError("Project not found.",404)
    }
    if(devExists.rowCount === 0) {
      throw new AppError("Developer not found.",404)
    }

    return next()
};
