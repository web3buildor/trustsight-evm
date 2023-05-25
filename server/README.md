# TrustSight API Server

The TrustSight server is a simple Node.js API server built with Express, interacting with a MongoDB database. It's designed to serve and manipulate data for the TrustSight application.

## API Endpoints

- `GET /api/address/:address`: Get metadata for a specific address. If the address does not exist, it will return a new metadata object with default values.
- `GET /api/reviews`: Fetch all reviews from the MongoDB database.
- `GET /api/reviews/:address`: Fetch all reviews for a specific address and compute average scores.
- `GET /api/projects/:category`: Fetch all projects that belong to a specific category.
- `POST /api/reviews`: Add or update a review to the MongoDB database.

## Usage

The server is initialized in `index.js`. It sets up middleware, defines routes, and starts listening on the configured port. The server connects to a MongoDB database via a connection string and performs CRUD operations through different API endpoints.

## Development

After cloning the repository, you can start the server with:

```bash
npm install
npm run dev
```


## Setup

This project uses [dotenv](https://www.npmjs.com/package/dotenv) for environment configuration. Please setup the following environment variables:

- `PORT`: The port number where the server will listen.
- `MONGO_USER`: The MongoDB user name.
- `MONGO_PW`: The MongoDB password.

## Dependencies

The project is built with the following dependencies:

- `express`: Web application framework for Node.js.
- `cors`: Middleware to enable CORS (Cross-Origin Resource Sharing).
- `helmet`: Middleware to secure Express apps by setting various HTTP headers.
- `mongodb`: The MongoDB driver for Node.js.
- `dotenv`: Zero-dependency module that loads environment variables from a `.env` file into `process.env`.

## EigenTrust

To read more about the EigenTrust algorithm that powers the review scoring system, read more [here](/server/EIGENTRUST.md).