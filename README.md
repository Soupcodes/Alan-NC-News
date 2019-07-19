# NC NEWS

NC News is an API built to interact with and draw news articles and associated data from a backend database.

A link to the hosted version can be found at https://alansoup-nc-news.herokuapp.com

## Getting Started

The following steps outline how to get the repository running on your local machine for testing purposes, as well as providing a general guideline for live deployment.

## 1 - Clone the repository

```bash
# git clone https://github.com/Soupcodes/Alan-NC-News.git

from your terminal to your desired folder and cd Alan-NC-News
```

### 1a - Create your own repository

On GitHub create your own public\* repository but **DO NOT to initialise with a README or .gitignore as these already included.**

Next, link your local copy to your newly created GitHub repo. Use the following terminal commands, making sure to check the git remotes with each step (`git remote -v`):

```bash
git remote remove origin

# This prevents you from pushing to the original Alan-NC-News repo.
```

```bash
git remote add origin <YOUR-GITHUB-URL>

# This will add your GitHub location to your local git repository.

# Confirm this by checking the new git remote.
```

## 2 - Setting up your environment and prerequisites

Once in your editor, the dependencies required for testing and deployment are listed in the **`package.json`** file.

To first initialise your repo, run:

```bash
# npm init -y
```

Run the following command in your CLI to then install **all** dependencies:

```bash
# npm i
```

To install each dependency manually:

```bash
# npm i < package name >
```

Tag a -d to the end of the install to identify which packages are mandatory for deployment. These will be listed under the 'dependencies'.

```bash
# npm i < package name > -d
```

```javascript
"dependencies": {
    "express": "^4.17.1",
    "knex": "^0.19.0",
    "pg": "^7.11.0"
  },
```

Tagging an uppercase -D indicates that the package is a devDependency and is required to utilise and run existing tests in the repo.

```bash
# npm i <package name> -D
```

```javascript
"devDependencies": {
    "chai": "^4.2.0",
    "chai-sorted": "^0.2.0",
    "mocha": "^6.1.4",
    "nodemon": "^1.19.1",
    "supertest": "^4.0.2"
  }
```

### 2a - Create your knexfile

You will need to create a `knexfile.js` in the root folder of the repo to enable knex to populate your database in step 3.

In the knexfile, paste the following code to enable testing and subsequent deployment.

`For Linux users` make sure to **CHANGE YOUR USERNAME AND PASSWORD FIELDS** to match your psql (postgres) credentials.

`For mac users` these fields can be deleted.

```javascript
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "YOUR USERNAME",
      password: "YOUR PASSWORD"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "YOUR USERNAME",
      password: "YOUR PASSWORD"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

## 3 - Seeding the database

To enable testing, you will need to create your databases and seed the associated schemas. All relevant scripts have been programmed into the repo and the following commands must be run in the command line interface in **the same order as demonstrated below**

1. `npm run setup-dbs` will generate your development and test databases. This **MUST** be run before any tests take place or there will be no databases to create schemas in and subsequent seeding will fail.

1. `npm run seed` will populate your schemas with the data provided. 'Rollback' and 'migrate latest' functionality has been built into this command to ensure a clean slate is generated for testing.

## 4 - Running the tests

Once your environment is setup, you can access the `/spec/app.spec.js` file to visualise the tests that have been developed to test this api.

To carry out automated testing, run the script:

```bash
# npm test (or `npm t` for short)
```

This will cycle through every test written for every endpoint.

The purpose of each test is to ensure the methods that have been developed for each endpoint of this api have been rigourously tested for frailties.

A dummy request is sent to the server to test its functionality and to ensure it returns the expected response as a result.

Considerations such as:

- GET requests to the server should return relevant data to the Client
- POST requests to the server will insert a new item into the database
- PATCH requests will update existing entries in the database
- DELETE requests remove an item from the database in its entirety and all corresponding entities associated with the parent data.
- INVALID endpoints or input data will throw an error message to the Client

For example:

GET `/api/topics` is a valid endpoint so the test ensures it returns an object in a format similar to the below to the Client:

```javascript
{
  topics: [
    { slug: "mitch", description: "The man, the Mitch, the legend" },
    { slug: "cats", description: "Not dogs" },
    { slug: "paper", description: "what books are made of" }
  ];
}
```

GET `/api/categories` is not a valid endpoint so the test ensures it returns an error message similar to the below

```javascript
{ status: 404, msg: 'Route not found' }
```

_A list of all the available endpoints can be found in the endpoints.json file_
