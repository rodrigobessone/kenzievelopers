import { Request, Response } from 'express';
import { createProject, getProjectById, updateProject } from '../services/projectService';
import { AppError } from '../errors/AppError';
import { checkDeveloperExists } from '../services/developerService';


export const createProjectController = async (req: Request, res: Response) => {
    const { name, description, repository, startDate, endDate, developerId } = req.body;
    if(developerId !== undefined){
      const developer = await checkDeveloperExists(developerId)
      if(developer.rowCount === 0){
        throw new AppError("Developer not found.", 404);
     }
    }
    const project = await createProject(name, description, repository, startDate, endDate, developerId);
    

      return res.status(201).json(project);
};

export const getProjectByIdController = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

      const project = await getProjectById(projectId);

      if(project.rowCount === 0){
        throw new AppError("Project not found", 404)
      }
  
      const selectedProject = project.rows[0];

      const formattedResponse = {        
              projectId: selectedProject.id,
              projectName: selectedProject.name,
              projectDescription:  selectedProject.description,
              projectRepository: selectedProject.repository,
              projectStartDate:selectedProject.startDate,
              projectEndDate: selectedProject.endDate,
              projectDeveloperName : selectedProject.developer_name
      }
      return res.status(200).json(formattedResponse);
};

export const updateProjectController = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const { name, description, repository, startDate, endDate, developerId } = req.body;

  const updatedProject = await updateProject(
    projectId,
    name,
    description,
    repository,
    startDate,
    endDate,
    developerId
  );

  return res.status(200).json(updatedProject.rows[0]);
};