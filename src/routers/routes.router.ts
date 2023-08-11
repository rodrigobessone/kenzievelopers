import express from 'express'
import { createDeveloperInfoController, deleteDeveloperController, getDeveloperByIdController, insertDeveloperController, updateDeveloperController } from '../controllers/developers.controller';
import { checkCreateDeveloperInfoMiddleware, checkDeveloperExistsMiddleware, checkEmailExistsMiddleware } from '../middlewares/developer.middleware';
import { createProjectController, getProjectByIdController, updateProjectController } from '../controllers/projects.controller';
import {  checkUpdateProjectMiddleware } from '../middlewares/project.middleware';

const router = express.Router();
 
router.post('/developers', checkEmailExistsMiddleware, insertDeveloperController);
router.get('/developers/:id', checkDeveloperExistsMiddleware, getDeveloperByIdController);
router.patch('/developers/:id', checkDeveloperExistsMiddleware, checkEmailExistsMiddleware, updateDeveloperController);
router.delete('/developers/:id', checkDeveloperExistsMiddleware, deleteDeveloperController)
router.post('/developers/:id/infos',checkDeveloperExistsMiddleware, createDeveloperInfoController);

router.post('/projects',createProjectController);
router.get('/projects/:id', getProjectByIdController);
router.patch('/projects/:id', checkUpdateProjectMiddleware, updateProjectController)

export default router;