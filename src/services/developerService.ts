import format from "pg-format";
import { client } from "../database";
import { AppError } from "../errors/AppError";

export const createDeveloper = async (name: string, email: string) => {
  const existingDeveloper = await client.query(
    format("SELECT * FROM developers WHERE email = %L", email)
  );

  if (existingDeveloper.rows.length > 0) {
    throw new AppError("Email already exists", 409);
  }
  const query = format(
    `INSERT INTO developers (name, email) VALUES (%L, %L) RETURNING *`,
    name,
    email
  );
  const result = await client.query(query);

  return result;
};

export const getDeveloperByEmail = async (email: string) => {
  const query = format("SELECT * FROM developers WHERE email = %L", email);
  const result = await client.query(query);
  return result;
};

export const getDeveloperById = async (id: number) => {
  const query = `
  SELECT
        d.id as "developerId",
        d.name as "developerName",
        d.email as "developerEmail",
        di."developerSince" as "developerInfoDeveloperSince",
        di."preferredOS" as "developerInfoPreferredOS"
      FROM
        "developers" d
      LEFT JOIN
        "developerInfos" di
      ON
        d.id = di."developerId"
      WHERE
        d.id = $1;
    `;
  
    const result = await client.query(query, [id]);
    const developer = result.rows[0];
  
    return developer || null;
  };

export const checkDeveloperExists = async (developerId: number) => {
  const query = format("SELECT * FROM developers WHERE id = %L", developerId);
  const result = await client.query(query);
  return result;
};

export const updateDeveloper = async (
  id: number,
  name?: string,
  email?: string
) => {
  if (!name && !email) {
    throw new AppError("No fields to update.", 400);
  }

  const updates: string[] = [];

  if (name !== undefined) {
    updates.push(`name = ${format('%L', name)}`);
  }
  if (email !== undefined) {
    updates.push(`email = ${format('%L', email)}`);
  }

  const query = format(
    `UPDATE developers SET ${updates.join(', ')} WHERE id = %L RETURNING *`,
    id
  );

  const result = await client.query(query);

  return result.rows[0];
};

export const checkEmailExists = async (email: string) => {
  const query = format("SELECT * FROM developers WHERE email = %L", email);
  const result = await client.query(query);
  return result.rows.length > 0;
};

export const deleteDeveloper = async (id: number) => {
  const query = format("DELETE FROM developers WHERE id = %L", id);
  await client.query(query);
};

export const createDeveloperInfo = async (
  developerId: number,
  developerSince: string,
  preferredOS: string
) => {
  const query = `
  INSERT INTO "developerInfos" ("developerSince", "preferredOS", "developerId")
  VALUES ($1, $2, $3)
  RETURNING *;
`;
const result = await client.query(query, [
  developerSince,
  preferredOS,
  developerId,
]);

return result.rows[0];
};

export const checkDeveloperInfo = async (developerId: number) => {
  const query = format(
    `SELECT * FROM "developerInfos" WHERE "developerId" = %L;`,
    developerId
  );
  const result = await client.query(query);

  if(result.rowCount > 0){
    throw new AppError("Developer infos already exist.", 409)
  }
  return result.rows[0];

};

export const checkPreferredOS = async (preferredOS: string) => {
  const query = format(
    `
      SELECT CASE
      WHEn %L = 'Windows' THEN true
      WHEn %L = 'Linux' THEN true
      WHEn %L = 'MacOS' THEN true
      END as is_valid_preferred_os  
  `,
    preferredOS,
    preferredOS,
    preferredOS
  );
  const result = await client.query(query);

  const checkOS = result.rows[0]?.is_valid_preferred_os;

  if (!checkOS) {
    throw new AppError("Invalid OS options.", 400);
  }
};
