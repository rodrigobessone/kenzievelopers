import format from 'pg-format';
import { client } from '../database';
import { AppError } from '../errors/AppError';

export const createProject = async (
  name: string,
  description: string,
  repository: string,
  startDate: Date,
  endDate: Date | null,
  developerId: number | null
) => {
    const query = format(`
      INSERT INTO projects (name, description, repository, "startDate", "endDate", "developerId")
      VALUES (%L, %L, %L, %L, %L, %L)
      RETURNING *
    `, name, description, repository, startDate, endDate, developerId);

    const result = await client.query(query);
    return result.rows[0];

};

export const getProjectById = async (projectId: number) => {
  const query = format(`
  SELECT 
    projects.id,
    projects.name,
    projects.description,
    projects.repository,
    projects."startDate",
    projects."endDate",
    developers.name AS developer_name
  FROM projects
  LEFT JOIN developers ON projects."developerId" = developers.id
  WHERE projects.id = %L
`, projectId);

      const result = await client.query(query);
      return result;
};

export const checkProjectExists = async (projectId: number) => {
      const query = format('SELECT * FROM projects WHERE id = %L', projectId);
      const result = await client.query(query);
      return result
};

export const updateProject = async (
    projectId: number,
    name?: string,
    description?: string,
    repository?: string,
    startDate?: Date,
    endDate?: Date,
    developerId?: number
  ) => {
    const query = format(
      `
      UPDATE "projects"
      SET "name" = COALESCE(%L, "name"),
          "description" = COALESCE(%L, "description"),
          "repository" = COALESCE(%L, "repository"),
          "startDate" = COALESCE(%L, "startDate"),
          "endDate" = COALESCE(%L, "endDate"),
          "developerId" = COALESCE(%L, "developerId")
      WHERE "id" = %L
      RETURNING *;
    `,
      name,
      description,
      repository,
      startDate,
      endDate,
      developerId,
      projectId,
    );
  
    const result = await client.query(query);
  
    if (result.rowCount === 0) {
      throw new AppError("Project not found.", 404);
    }
  
    return result;
  };
  