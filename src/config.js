import { join } from 'node:path';

export const config = {
  port: process.env.PORT ?? 3000,
  cheminCsv: join(process.cwd(), process.env.CSV_PATH ?? 'donnees/meteo.csv'),
};