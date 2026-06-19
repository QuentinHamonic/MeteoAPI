import { join } from 'node:path';

const portEnv = Number(process.env.PORT);
const portValide = Number.isInteger(portEnv) && portEnv > 0;
if (process.env.PORT !== undefined && !portValide) {
  console.warn(`PORT="${process.env.PORT}" invalide, utilisation du port par défaut 3000`);
}
const port = portValide ? portEnv : 3000;

export const config = {
  port,
  cheminCsv: join(process.cwd(), process.env.CSV_PATH ?? 'donnees/meteo.csv'),
  cheminDb: join(process.cwd(), process.env.DB_PATH ?? 'donnees/meteo.db'),
};