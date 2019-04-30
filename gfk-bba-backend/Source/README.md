// TODO https://github.com/typeorm/typeorm/issues/2572

Auf dem Server nicht vergessen:
apt-get install git-core curl build-essential

# gfk-bba-backend

## Description

The backend of the gfk-bba project, based on nestjs

## Dependencies

- Node v10.7.0, npm 6.4.1
- PostgreSQL 10.5

(might work with others versions, but untested)

Make sure you dont use outdated versions of nest (e.g. 5.1)
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
will update to 5.3.6 ... and this is needed for auth.

## Installation

```bash
$ npm install
```

For migrations we need typeorm globally:

```bash
npm i typeorm -g
```

## Database config

please check/change the values in /Source/ormconfig.json, especially

- "host": "localhost",
- "port": 5432,
- "username": "gfkbba",
- "password": "",
- "database": "postgres",

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Filling the database with test data

Test data is included in the migrations, so please run them

```bash
npm run migrate
```

## Access of the backend

[http://localhost:3001]()

e.g.

[http://localhost:3001/coupons]()

## Authorization

JWT-based

Call http://localhost:3001/auth/token
to get a token

```
curl -X POST \
  http://localhost:3001/auth/token \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Postman-Token: b376582c-4b02-4a25-8c92-866167910828' \
  -d 'email=testemail@test.com&password=password'
```

This will deliver the token, e.g.

```
{"expiresIn":3600,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBldGVyLmRpY2t0ZW5AZGNzLWZ1ZXJ0aC5kZSIsImlhdCI6MTUzNzE2NzA3MSwiZXhwIjoxNTM3MTcwNjcxfQ.OzJJRBEMF_0pclYMBkM9BbA7UQQoTU3vs4tVrYJfxHU"}
```

Token testen / verwenden

```
curl -X GET \
  http://localhost:3001/auth/data \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBldGVyLmRpY2t0ZW5AZGNzLWZ1ZXJ0aC5kZSIsImlhdCI6MTUzNzE2NzA3MSwiZXhwIjoxNTM3MTcwNjcxfQ.OzJJRBEMF_0pclYMBkM9BbA7UQQoTU3vs4tVrYJfxHU' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Postman-Token: b73af1c3-ace8-40d5-a631-3dc974875f05'
```

This should return

`Welcome user 1`

or

`{"statusCode":401,"error":"Unauthorized"}` if the token is invalid

## Swagger

```bash
$ npm run swagger
```

See API at [http://localhost:3001/api/]()

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Run on Server

in /root/Source
screen ./start.sh

(und CTRL+A CTRL+D um screen zu erlassen)

