# Boiler-plate
Boiler plate for nest js with postgres. It has two branches. 

# Branches

## Master branch

Master branch contains following

1. Users module
2. Auth module (JwtAuth Guard)
3. Passport jwt strategy
4. Seeders (users)
5. Global exception handling 

## User-roles-with-rbac

This branch have following 

1. Auth module (JwtAuth Guard, Permission Guard)
2. Files module (for uploading and downloading of files in AWS bucket using signed urls)
3. Groups module
4. Permissions module (with rbac)
5. Roles module
6. Shared module (includes email service, aws service, custom decorators, templates, transformers, etc.)
8. Users module
9. Users-group module
10. Users-role module
11. Seeders (users, roles, permissions)
12. Passport jwt strategy
13. Global exception handling

# Database
1. PostgreSQL 

# Getting started

## Pre-requisites
1. Node 20.10.0
2. Nestjs 10.2.1
3. postgres 16.1
4. typeorm 0.3.17

## APIs documentation 
APIs swagger docuementaion is available at baseUrl + /api-docuementation
e.g.
if you are using localhost at port 3000, then this app backend will work at url: "https://localhost:3000"
you can find apis documentation at "https://localhost:3000/api-documentation" 

### Swagger documentation
For swagger documentation, @nestjs/swagger plugin is used in nest-cli with suitable options.

## Running the app

1. npm i
2. create db and update env accordingly
3. run migrations using package.json script
4. run seeders using package.json script

$ npm run start 
or
$ npm run start:dev (watch mode)

## migrations
1. use package.json scripts to generate, create, run & revert migrations

## Authentication
For authentication JWT is used with passport strategy
