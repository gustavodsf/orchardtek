### orchardtek

This application was created using Express.js, Supertest and TypeORM:

- Whenever you want to install dependencies uses the following command

`npm install`

- To start the application uses the following command:

`npm run dev`

> [!TIP]
> remember to create your own .env inside the root of the project
 

- To run tests uses the following command:

`npm run test`

> [!CAUTION]
> The test has some race condition problems. It is working, but I think that at some point, part of the code is trying to change the database when it is already closed or is trying to run the test before the connection is established.

#### Folder structure
```
├── src
│   ├── common
│   │   ├── middleware/
│   │   │   ├── error.handler.test.ts # test if api not found works
│   │   │   ├── error.handler.ts # handle ours application error
│   │   │   ├── rate.limiter.ts # add configuration to the rate limiter 
│   │   │   ├── request.logger.ts # used to log ours request
│   │   │   └── validate.request.ts # uses zod to validate the request
│   │   └── utils
│   │   │   ├── env.config.ts # used to read the environment variables and validate it
│   │   │   ├── http.handler.ts # used to organizer our response in a better shape
│   │   │   └── types.ts # types that are used in more than one place
│   ├── database/ # place we sqlite store the file
│   ├── healthCheck/
│   │   ├── health.check.router.test.ts # test to check if the health endpoint works
│   │   └── health.check.router.ts # used to check if the service is up and running
│   └── posts/ 
│       ├── posts.controller.ts # reive the data from the router organize and send to the service.
│       ├── posts.model.ts # store the entity and the schemas.
│       ├── posts.router.test.ts # integration test for (Delete, Update, Create, Retrieve).
│       ├── posts.router.ts # create the router validate income request and pass to the controller.
│       └── posts.service.ts # get all the data from database and apply some logic.
├── .eslintrec.json # config lint and what we are going to consider as error.
├── vite.config.mts # used together with jest to run the test.
├── tsconfig.json # specify how we are going to transpile our code to javascript.
├── .prettierignore # files or directory that prettier should ignore.
├── .prettierrc  # file specify to prettier some custom configuration. 
├── .env.example # file that contains example of environment variables.
├── package.json
├── jest.config.js # store all configuration for jest.
└── README
```


#### This repository is to solve the following challenge
```
Directions: Please implement a RESTful API endpoint using TypeScript and Node.js that allows users to create and retrieve blog posts. The implementation should follow a test-driven development (TDD) approach. The endpoint should meet these requirements:

- Use Express.js as the web framework [X]
- Implement proper error handling and input validation [X]
- Use a data storage of your choice [X - sqlite]
- Follow a strict TDD approach, writing tests before implementing the corresponding functionality [X]
- BONUS POINTS: implement auth. [ ]
```
