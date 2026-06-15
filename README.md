# MeteoAPI

API météo construite avec Node.js et Express.

## Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)

## Installation

```bash
git clone https://github.com/QuentinHamonic/MeteoAPI.git
cd MeteoAPI
npm install
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

| Variable | Description        | Défaut |
| -------- | ------------------ | ------ |
| `PORT`   | Port d'écoute HTTP | `3000` |

## Endpoints

| Méthode | Route | Description           |
| ------- | ----- | --------------------- |
| `GET`   | `/`   | Vérifie l'état de l'API |

## Licence

ISC
