# planET

In today's world, it is often confusing to plan out a trip, requiring one to visit multiple different sites and to carefully cross-reference details between different companies. We aim to fix these issues, by simplifying the process of planning out a perfect trip, organizing itineraries, historical places, and activities in any and all countries one might want to visit all in one place. With real-time suggestions, integration with maps, and a user-friendly interface, we hope to transform how people discover and experience new places and countries.
This project uses the MERN stack.

## Table of Contents

- [Build Status](#build-status)
- [Tech/Framework](#tech-stack)
- [Code Style](#code-style)
  - [General Coding Guidelines](#general-guidelines)
  - [Front-End (React)](#front-end-react)
  - [Back-End (Node.js & Express)](#back-end-nodejs--express)
    - [Folder Structure](#folder-structure)
    - [Routing](#routing)
    - [Controller Functions](#controller-functions)
    - [Services](#services)
    - [Dependency Injections](#dependency-injections)
    - [Interfaces](#interfaces)
    - [Middleware](#middleware)
    - [Error Handling](#error-handling)
  - [Database (MongoDB)](#database-mongodb)
    - [Schema Design](#schema-design)
    - [Queries & Aggregations](#queries--aggregations)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Features](#features)
  - [Features For Tourists](#features-for-tourists)
  - [Features For Advertisers](#features-for-advertisers)
  - [Features For Tour Guide](#features-for-tour-guides)
  - [Features For Sellers](#features-for-sellers)
  - [Features For Tourism Governor](#features-for-tourism-governor)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [API References](#api-reference)
- [Contributions](#contributions)
- [Credits](#credits)
- [License](#license)

## Build Status

yes

## Tech Stack

This project is built using the **MERN** stack, which consists of the following technologies:

- **MongoDB**: A NoSQL database used for storing and managing data. It stores data in a flexible, JSON-like format, making it ideal for handling large amounts of unstructured data.
- **Express.js**: A web application framework for Node.js, used to handle HTTP requests, routing, and middleware. It provides a robust set of features to build web and mobile applications.
- **React.js**: A JavaScript library for building user interfaces. React allows for creating dynamic, single-page applications (SPAs) with a component-based architecture.
- **Node.js**: A JavaScript runtime environment that executes JavaScript code outside of a browser. Node.js allows for building scalable network applications and is the backend runtime for this project.

- **TypeScript**: A superset of JavaScript that adds static types. TypeScript helps in building more robust and maintainable code, providing features like type checking, interfaces, and better tooling support during development.

### Additional Technologies/Tools

- **Redux**: A state management library for React applications, helping manage global state in a predictable way.

- **Mongoose**: A MongoDB object modeling tool designed to work in an asynchronous environment. It provides a straightforward way to interact with MongoDB databases using schemas and models.

- **Axios**: A promise-based HTTP client used to make API calls from the React frontend to the Express backend.

- **Nodemon**: A tool that automatically restarts the Node.js server when file changes are detected, making development easier.

- **Nodemailer**: Used for sending emails from the server, such as account confirmation, notifications, or password resets.

- **express-jwt**: Middleware for validating JSON Web Tokens (JWT) and securing API endpoints.
- **express-basic-auth**: Middleware for basic authentication of API routes.
- **jsonwebtoken**: Library for generating and verifying JWTs to authenticate users.

- **error-handler**: A package that improves error handling and debugging, useful only in development environments.
- **express-async-errors**: A middleware to handle errors in asynchronous functions, avoiding unhandled promise rejections.

- **dotenv**: Loads environment variables from a `.env` file, helping with configuration management.

- **CORS**: Middleware to enable cross-origin requests, allowing the frontend and backend to communicate securely.

- **bcrypt**: A library used to hash and encrypt passwords before storing them in the database.

- **Agenda**: A job scheduling library for handling background tasks, such as sending emails or running scheduled operations.

- **Winston**: A versatile logging library for recording logs and errors in various formats, useful for debugging and monitoring.

- **Typedi**: A dependency injection tool for managing object creation and dependencies, enhancing testability and maintainability.

- **event-dispatch**: Allows registering subscribers and dispatching events across the application, enabling event-driven architecture.

## Code Style

### General Guidelines

- **Consistency**: Follow a consistent coding style throughout the codebase.
  - Stick to camelCase for variable and function names, PascalCase for model names, and UPPER_SNAKE_CASE for environment variables.
  - Use prettier inside your personal editor of choice, or use `npx prettier --write` to format the code.
- **Documentation**: Write clear and concise comments, and use swagger to document APIs.
- **Error Handling**: Do not use try-catch for errors. Instead, throw the exceptions normally, and let the our error handler take care of it
- **Security**: Use environment variables for sensitive information.

## Front-End (React)

### idk

## Back-End (Node.js & Express)

### Folder Structure

```src
│   app.js             # App entry point
└───api                # Express route controllers for all the
└───api-specifications # Document any API route here
└───config             # Environment variables and configuration endpoints of the app
└───decorators         #
└───interfaces         #
related stuff
└───jobs               # Jobs definitions for agenda.js
└───loaders            # Split the startup process into modules
└───models             # Database models
└───services           # All the business logic is here
└───subscribers        # Event handlers for async task make this folder structure in the readme
└───types              # Type declaration files (d.ts) for Typescript
```

### Routing

- Use Express Router to organize routes into seperate files based on the resources, i.e if it is a model in the database, then most likely a route should be made for it.
- All routes automatically have /api/ attached to the start, and should have the resource name after the /api/, then the route itself (e.g., /api/user/getActivities)
- Use RESTful API conventions (GET, POST, PUT, DELETE)
- Do not handle any business logic inside of the routes.

### Controller Functions

- Do not put any business logic inside of the controllers, this is the responsibility of the services.
- Take the needed information from the request, pass it down to the service, then return a response
- Do not pass the response or request directly to the service
- Example:

```ts
  public async createItinerary(req: Request, res: Response): Promise<void> {
    const itineraryData = req.body as IItineraryCreateDTO;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const newItinerary = await itineraryService.createItineraryService(
      itineraryData
    );
    res.status(newItinerary.status).json(newItinerary);
  }
```

### Services

- All business logic is all handled here.
- All services return our response class.
- Example:

```ts
  public async getActivityByIDService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel.findById(new Types.ObjectId(id))

    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    if (activity == null) throw new NotFoundError("Activity not found");

    return new response(true, activity, "Activity is found", 200);
  }
```

### Dependency Injections

- To ease the use of models inside of services, we inject any needed models, and use containers whenever we need to use these services.
- We use `typedi` to handle dependency injection
- Example:

```ts
// Creating the service
@Service()
export default class ActivityService {
  constructor(
    @Inject("activityModel") private activityModel: Models.ActivityModel,
  ) {}
...
// Call the service in another class
const activityService: ActivityService = Container.get(ActivityService);
const activity = await activityService.getActivityByIDService(id);

```

### Interfaces

- Any created model must have a corresponding interface
- For any response or request that has more than 3 parameters should be made an interface, then use that interface as its type.
- Example:

```ts
export interface IComplaintAdminViewDTO {
  tourist_name: ObjectId;
  complaint_id: ObjectId;
  body: string;
  reply?: string;
  title: string;
  date: Date;
  status: ComplaintStatus;
  createdAt?: Date;
}
```

### Middleware

- Use middleware for checks that must be done on multiple routes, such as authentication and authorization checks.
- Always add `next()` so the route handler can be run.

### Error Handling

- Any time an error is needed to be thrown due to a bad request, use the errors found in `types/Errors.ts`
- If one of the error classes do not satisfy the API needs, use the generic HttpError and provide your own error code, or create a new error extending the HttpError.
- These errors are handled by our error handler, so no need for try-catch blocks, simply throw the error.

## Database (MongoDB)

### Schema Design

- Use Mongoose for defining schemas and interacting with MongoDB.
- Define the schemas with the following guidelines:
  - Use `snake_case` for field names (e.g., `first_name`)
  - Use `timestamps: true` to automatically track `createdAt` and `updatedAt`.
- Example:

```ts
// Definition of the schema:
const tourGuideSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    years_of_experience: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Tour_Guide = mongoose.model<ITour_Guide & mongoose.Document>("Tour_Guide", tourGuideSchema);

export default Tour_Guide;

// Definition of IUser is as follows:
export interface ITour_Guide extends Document {
  user_id: ObjectId;
  itineraries: ObjectId[];
  years_of_experience?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Queries & Aggregations

- Use Mongoose's built-in methods (e.g., find(), findOne(), updateOne()) for simple queries.
- Use MongoDB aggregation pipeline for complex queries.

## Testing

- Use Postman to test APIs.

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Features

### Features For Tourists

- Book itineraries and activities all over the world.
- Look at the most popular historical locations wherever.
- Book hotels and airplanes through the site directly.
- Bookmark your favorite activities.
- Browse through an endless shop containing all types of souveniers.
- Wishlist your most wanted products.
- Receive loyalty points for every payment done
- Use your loyalty points to recieve cash inside your wallet
- Get promocodes, and apply them to whatever you want

### Features For Advertisers

- Create activities for tourists to book and enjoy through the site.
- Track your earnings overall or for a specific activity

### Features For Tour Guides

- Create and personalize your profile with your past experiences.
- Create itineraries for people to experience.
- Track your earnings overall or for a specific itinerary.

### Features For Sellers

- Create a product for tourists to buy.
- Track your earnings overall or for a specific product.

### Features For Tourism Governor

- Create historical places for people to find and experience inside your country.

## Installation

This guide will help you get up and running with the MERN stack application (MongoDB, Express, React, Node.js) quickly.
Ensure you have the following software installed before getting started:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)
- (Optional) [MongoDB](https://www.mongodb.com/) (Either install locally or use a cloud provider like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

#### 1. Clone the Repository

Start by cloning the repository to your local machine.

```bash
git clone https://github.com/Advanced-computer-lab-2024/planET.git
cd planET
```

#### 2. Set Up the Backend

Start up a terminal session and naviagate to the backend directory starting the from main directory and download needed dependencies.

```bash
cd API
npm i
```

The next step is to setup the enviroment file to store all our sensitive variables. Create a new file called `.env` inside the [src](/API/src/) directory. Using the below variable names as reference, replace them with your own keys and links.

```
7ot enta el .env 3ashan ana mesh 3aref eh el momken yet7at hena :)
```

#### 3. Set Up the Frontend

Return to the project root directory by using:

```bash
cd ..
```

Naviagate to the frontend directory and download the needed dependencies:

```bash
cd Frontend
npm i
```

## How to Use

After finishing the above steps, running the project is relatively simple, all one needs is two terminal sessions and a browser.

Start both terminal session in the project root folder, and run the following commands to run the backend:

```bash
cd API/src
npx nodemon ./app.ts
```

This should run the backend server at the port 8000 by default, unless it was changed in the .env file.

Following that, using the other terminal session, navigate to frontend directory and start the server:

```bash
cd Frontend
npm start
```

This should run the frontend server at port 3000 by default, and can be visited by going to `http:localhost:3000`.

Once the site opens up, then congratulations! You have successfully ran our site.

## API References

This project uses OpenAPI 3 for generating and maintaining our API documentation. All of the files can be found inside of [api-specifications](/API/src/api-specifications/) folder.

## Contributions

We welcome contributions from everyone! Whether you’re fixing a bug, suggesting a new feature, or improving documentation, your help is highly appreciated. Here’s how you can contribute to the **Virtual Trip Planner** project:

### Ways to Contribute:

- **Report Bugs:** If you find a bug or issue, please report it by creating an issue in the Issues section.
- **Request Features:** Got an idea for a cool new feature? Open an issue or create a pull request (PR) with your proposal.
- **Fix Issues:** Check the Issues section for open tasks, such as bug fixes or enhancement suggestions, and help us resolve them.
- **Improve Documentation:** Documentation is crucial! If you notice any areas that could be improved, feel free to submit a pull request with better explanations or updates.
- **Submit Code:** If you have a fix or feature you’d like to add, fork the repository, create a new branch, and submit a pull request with your changes. Be sure to follow the coding style and guidelines of the project.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature or fix'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a Pull Request.

### Code of Conduct:

Please be respectful and welcoming in your interactions with others. We are committed to creating a positive, inclusive community.

## Credits

Special thanks for the following blogs for our frontend and backend architecture

- [Frontend Architecture](https://www.upgrad.com/blog/react-js-architecture/)
- [Backend Architecture](https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf)

And the below videos and blogs for teaching us the MERN stack

- [MERN Stack](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE)
- [React useEffect and useState](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)

And for our TAs for being with us throughout the semester <3

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

The Apache License 2.0 allows you to freely use, modify, and distribute this project, but with certain conditions. Please refer to the full [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.
