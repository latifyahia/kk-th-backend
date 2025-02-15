# kk-th-backend

## Introduction

This is a backend built with NestJS. This is my first time using NestJS. This backend accompanies the [kk-th-frontend](https://github.com/latifyahia/kk-th-frontend)

I spent a few hours over two days learning NestJS and implementing this backend from scratch. Although I'm new to NestJS, I tried to follow best practices from online research and documentation.

I've set up multiple modules that handle different functionalities. For example, I have a `UserModule` that handles (mocking) getting user data, which can be used across different modules that require access to fetch user data from a database. I also set up a `PricingService` module that handles calculating the prices of the user's next delivery. Although its functionality is limited within my codebase, in a real application, a pricing service would communicate with a database that stores different prices for various items and can calculate a wide range of things for our application.

I attempted to make everything as modular as possible, clearly differentiating between different services that our application might need to promote a clean codebase and reusability of the code.

I've also included extensive unit tests to ensure the code I wrote is adequately tested.

## Available Endpoints

### GET /api/v1/comms/your-next-delivery/:userId

Returns the user's next delivery details:

```json
{
  "title": "The title built specifically for that user",
  "message": "The message built specifically for that user",
  "totalPrice": "The total price for the user's cart with active subscriptions",
  "freeGift": "true or false if the user's order is above 120 pounds, a free gift is given to that user"
}
```

### GET /api/v1/comms/welcome-fresh/:userId

Returns the welcome message for a user:

```json
{
  "message": "The message built specifically for that user"
}
```

**Note:** A valid `userId` is required to get a valid 200 response from the endpoint. If an invalid `userId` is used to call the endpoints, appropriate error handling is set up to return a 404 if the user does not exist and a 500 if an internal server error occurs.

## Getting Started

### Prerequisites

To run this locally, you will need:

- Node.js >= 20.0.0

### Running Locally

1. Clone this repository.
2. Run `npm install`.
3. Run `npm run start`.

After following these steps, you should be able to hit the endpoints mentioned above (note this API service runs on `localhost:3000`).

### Frontend Integration
To utilize the frontend with this backend, follow the instructions in the [kk-th-frontend](https://github.com/latifyahia/kk-th-frontend) repo. Ensure the backend is running locally before starting the frontend.

### Running Tests

To run the tests, use `npm run test`.

### Final Remarks

I really enjoyed working with NestJS. I found it extremely fun to work with and easy to use (I still don't know everything but will continue to learn).
