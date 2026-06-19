# MeteoAPI

API météo construite avec Node.js et Express.

Les données sont stockées dans une base **SQLite** ([better-sqlite3](https://github.com/WiseLibs/better-sqlite3)). Au premier démarrage, si la base est vide, les relevés du fichier CSV (`donnees/meteo.csv`) sont importés automatiquement.

## Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)

## Installation

```bash
git clone https://github.com/QuentinHamonic/MeteoAPI.git
cd MeteoAPI
npm install
cp .env.example .env
```

## Lancement

```bash
# Mode production
npm start

# Mode développement (rechargement auto)
npm run dev
```

Le serveur démarre par défaut sur [http://localhost:3000](http://localhost:3000).

## Configuration

Copie `.env.example` en `.env` et ajuste si besoin :

| Variable   | Description                              | Défaut             |
| ---------- | ---------------------------------------- | ------------------ |
| `PORT`     | Port d'écoute HTTP                       | `3000`             |
| `CSV_PATH` | Chemin relatif vers le CSV (import initial) | `donnees/meteo.csv` |
| `DB_PATH`  | Chemin relatif vers la base SQLite       | `donnees/meteo.db` |

## Endpoints

| Méthode  | Route            | Description                              |
| -------- | ---------------- | ---------------------------------------- |
| `GET`    | `/healthcheck`   | Vérifie l'état de l'API                  |
| `GET`    | `/releves`       | Liste tous les relevés météo             |
| `GET`    | `/releves/:id`   | Récupère un relevé par son identifiant   |
| `POST`   | `/releves`       | Crée un nouveau relevé                   |
| `PUT`    | `/releves/:id`   | Modifie un relevé existant               |
| `DELETE` | `/releves/:id`   | Supprime un relevé                       |
| `GET`    | `/villes`        | Liste les villes avec leurs agrégats     |
| `GET`    | `/villes/:ville` | Relevés météo d'une ville                |
| `GET`    | `/stats`         | Statistiques globales                    |
| `GET`    | `/api-docs`      | Documentation Swagger interactive        |

## Client CLI

Le dossier [`MeteoCLI/`](MeteoCLI/) contient un client en ligne de commande, indépendant de l'API (aucun fichier partagé, communication uniquement via HTTP).

```bash
cd MeteoCLI
npm install
cp .env.example .env
npm start
```

L'API doit être démarrée au préalable. L'URL de base est configurable via `API_URL` dans `MeteoCLI/.env` (défaut : `http://localhost:3000`).

## Licence

[MIT](LICENSE)
