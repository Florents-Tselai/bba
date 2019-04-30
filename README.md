# Blockchain-backed analytics

## Introduction

“Blockchain-backed analytics” (BBA), is a scalable and easy-to-use generic approach to introduce quality gates to data science projects, backed by the immutable records of a blockchain.
Data, models and results are stored as cryptographically hashed fingerprints with mutually linked transactions in a public blockchain database in order to enable stakeholders of data science projects to track and trace the linkage of data, applied models and modeling results without the need of trust validation of escrow systems or any other third party.

The BBA application enables you create & manage a trusted analytics projects via a graphical (browser based) solution and to track past projects and lookup & visualize the corresponding data-model-result linkage. New Components can be registered in the Ethereum blockchain in an intuitive way.

Read the [full paper](http://dx.doi.org/10.4995/CARMA2018.2018.8292) for more details:
Herrmann et al. (2018): Blockchain-backed analytics. Adding blockchain-based quality gates to data science projects. Proceedings of the 2nd International Conference on Advanced Research Methods and Analytics. Editorial Universitat Politecnica de Valencia, Valencia, 2018.


## Installation instructions for GfK-BBA

### Overview

BBA consists of 3 parts:
1.	A database (PostgreSQL 9.5+)
2.	A backend system (based on NodeJS and NestJS)
3.	A frontend application (based on Angular 6.1)

BBA will be deployed in two Docker container:
-	The app container (parts 2+3)
-	The database  container (part 1)

Prerequisites 
-	Docker (tested with Engine 18.09.0 and Compose 1.23.2)
-	NodeJS (tested with 10.7.0) including NPM (tested with 6.4.1)
-	GIT (tested with 2.17.2)


### Build & run

#### Step 1: (rebuild) Frontend

Make sure that the payment settings in `gfk-bba-frontend/src/app/dashboard/confirm-document/confirm-document.component.ts are correct`

```bash
cd gfk-bba-frontend
npm install
npm run integrate
```

The last step will compile + optimize the frontend code and copy the result to ../gfk-bba-backend/Source/src/dist

 
#### Step 2: Create containers

Make sure that settings in 
-	gfk-bba-backend/Config/Backend/.env.prod
-	gfk-bba-backend/Config/Database/ormconfig.prod
are correct.

```bash
cd gfk-bba-backend/
docker-compose up -d
```

The application should be accessible at `http://localhost:80`

Access the logs:
```bash
cd gfk-bba-backend/
docker-compose logs
```

Shutdown containers:
```bash
cd gfk-bba-backend/
docker-compose down
```