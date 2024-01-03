# Boiler-plate
Boiler plate for nest js with postgres. It provides users module and auth module with jwt authentication using passport jwt strategy

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

$ npm run start 
or
$ npm run start:dev (watch mode)

## migrations
1. use package.json scripts to generate, create, run & revert migrations

## Authentication
For authentication JWT is used with passport strategy
