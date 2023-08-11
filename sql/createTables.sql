DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OS' AND typtype = 'e') THEN
    CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOS');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "developers" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "developerInfos" (
  "id" SERIAL PRIMARY KEY,
  "developerSince" DATE NOT NULL,
  "preferredOS" "OS" NOT NULL,
  "developerId" INTEGER NOT NULL UNIQUE,
  FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT,
  "repository" VARCHAR(120) NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE,
  "developerId" INTEGER,
  FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE SET NULL
);
