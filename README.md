## Description

A basic user management backend server using NestJS.
A user can register, log in and upload a photo.
Only registered users can upload a photo.

## Tech

- NestJS
- Typescript
- Typeorm
- Postgres
- JWT

## Installing the app

```bash
$ git clone https://github.com/BettySosterics/nest-typeorm
$ cd nest-typeorm
$ pnpm install
```

## Environmental variables

- `PGHOST`
- `PGUSERNAME`
- `PGPASSWORD`
- `PGDATABASE`
- `JWT_SECRET`

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## API Endpoints

```bash
GET: localhost:3000/api/

POST: localhost:3000/api/auth/register

POST: localhost:3000/api/auth/login

POST: localhost:3000/api/user/upload

GET: localhost:3000/api/user/image-name
```
