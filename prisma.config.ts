// npm install --save-dev dotenv (already a transitive dep, but install explicitly if `prisma generate`/`db push` can't find DATABASE_URL)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
