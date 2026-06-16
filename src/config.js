import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  cheminCsv: join(__dirname, '../donnees/meteo.csv'),
};