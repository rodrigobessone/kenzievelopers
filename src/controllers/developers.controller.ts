import { Request, Response } from "express";
import {
  checkDeveloperInfo,
  checkPreferredOS,
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "../services/developerService";

export const insertDeveloperController = async (
  req: Request,
  res: Response
) => {
  const { name, email } = req.body;
  const developer = await createDeveloper(name, email);
  return res.status(201).json(developer.rows[0]);
};

export const getDeveloperByIdController = async (
  req: Request,
  res: Response
) => {
  const developerId = Number(req.params.id);
  const developerData = await getDeveloperById(developerId);
  return res.status(200).json(developerData);
};

export const updateDeveloperController = async (
  req: Request,
  res: Response
) => {
  const developerId = req.params.id;
  const { name, email } = req.body;
  const updatedDeveloper = await updateDeveloper(Number(developerId), name, email);
  return res.status(200).json(updatedDeveloper);
};

export const deleteDeveloperController = async (
  req: Request,
  res: Response
) => {
  const developerId = Number(req.params.id);
  await deleteDeveloper(developerId);
  return res.status(204).send();
};

export const createDeveloperInfoController = async (
  req: Request,
  res: Response
) => {
  const {id} = req.params;
  const developerId = Number(id);
  const { developerSince, preferredOS } = req.body;

  await checkPreferredOS(preferredOS)

  await checkDeveloperInfo(developerId)

  const addDeveloperInfo = await createDeveloperInfo(
    developerId,
    developerSince,
    preferredOS
  );  

  return res.status(201).json(addDeveloperInfo);
};
