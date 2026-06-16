# MeteoAPI

API météo construite avec Node.js et Express.

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

| Variable   | Description               | Défaut                |
| ---------- | ------------------------- | --------------------- |
| `PORT`     | Port d'écoute HTTP        | `3000`                |
| `CSV_PATH` | Chemin relatif vers le CSV | `donnees/meteo.csv`  |

## Endpoints

| Méthode | Route            | Description                              |
| ------- | ---------------- | ---------------------------------------- |
| `GET`   | `/healthcheck`   | Vérifie l'état de l'API                  |
| `GET`   | `/releves`       | Liste tous les relevés météo             |
| `GET`   | `/releves/:id`   | Récupère un relevé par son identifiant   |
| `GET`   | `/villes`        | Liste les villes avec leurs agrégats     |
| `GET`   | `/villes/:ville` | Relevés météo d'une ville                |
| `GET`   | `/stats`         | Statistiques globales                    |
| `GET`   | `/api-docs`      | Documentation Swagger interactive        |

## Licence

ISC
